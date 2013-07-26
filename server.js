var
    fs = require('fs')
  , http = require('http')
  , config = require('./config')
  , e = require('./lib/exceptions')
  , models = require('./lib/models')
  , mongoose = require('mongoose')
  , server, db


server = http.createServer(function(request, response) {
  var link
    , body
    , chunk

  try {
    if (request.url === '/links') {
    response.setHeader('Content-Type', config.JSON_MIME)

      switch (request.method) {

        case 'GET':
          models.Link.find({}, function(error, links) {
            if (error)
              throw new e.MongoDBError(error)

            response.end(JSON.stringify(links))
          })
          break

        case 'POST':
          if (request.headers['content-type'] !== config.JSON_MIME)
            throw new e.HTTPPostContentTypeError(request.headers['content-type'])

          body = ''
          request.on('readable', function() {
            while (chunk = request.read())
              body += chunk
          })

          request.on('end', function() {
            body = JSON.parse(body)

            if (!body.title || !body.url)
              throw new e.HTTPPostBodyError('Link title and URL are required.')

            link = {
                title: body.title
              , url: body.url
            }

            models.Link.create(link, function(error, link) {
              if (error)
                throw new e.MongoDBError('Could not save link: ' + error)

              response.end(JSON.stringify(link))
            })
          })
          break
      }
    }
    else {
      throw new e.HTTPResourceDoesNotExist(request.url)
    }
  }
  catch (error) {
    console.log('Caught Exception `' + error.name + '`: ' + error.message)
    response.end(error.message)
  }
});

mongoose.connect(config.MONGOOSE_URL)
db = mongoose.connection

db.on('error', function(error) {
  console.error('MongoDB connection error: %s', error)
  process.exit(1)
})

db.once('open', function() {
  console.log('Connected to MongoDB at %s', config.MONGOOSE_URL)

  server.listen(config.LISTEN_PORT, function() {
    console.log('Listening for HTTP requests on port %d', config.LISTEN_PORT)
  })
})