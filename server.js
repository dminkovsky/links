var fs = require('fs')
  , http = require('http')
  , EE = require('events').EventEmitter
  , config = require('./config')
  , e = require('./lib/errors')
  , models = require('./lib/models')
  , mongoose = require('mongoose')
  , select_fields = ['title', 'url', '__v']
  , pretty_json = require('./lib').pretty_json
  , error_json = require('./lib/errors').error_json
  , server, db

server = http.createServer(function(request, response) {
  var error_dispatch = new EE
    , path_matches, link, body, chunk

  error_dispatch.on('error', function(error, status_code) {
    response.statusCode = status_code || 400
    response.end(error_json(error.message))
  })

  response.setHeader('Content-Type', config.JSON_MIME)

  path_matches = request.url.match(/^\/(links)(?:(?:\/([0-9a-f]{24}))|(?:\?(.+)$))?$/)

  if (!path_matches) {
    error_dispatch.emit('error', new e.HTTPResourceDoesNotExist(request.url), 404)
    return
  }

  if (path_matches[1] === 'links') {
    switch (request.method) {
      case 'GET':
        // /links/51f3ebcac355d07935000006
        if (path_matches[2]) {
          models.Link.find({_id: path_matches[2]}, select_fields.join(' '), function(error, link) {
            if (error) {
              error_dispatch.emit('error', new e.MongoDBError(error))
              return
            }
            if (!link.length) {
              error_dispatch.emit('error', new e.HTTPEntityDoesNotExist('Link `' + path_matches[2] + '`'), 404)
              return
            }
            if (link.length === 1) {
              response.end(pretty_json(link.pop()))
            }
            else {
              // How do I write a test for this?
            }
          })
        }

        // /links?foo=bar
        else if (path_matches[3]) {
        }

        // /links
        else {
          models.Link.find({}, select_fields.join(' '), function(error, links) {
            if (error) {
              error_dispatch.emit('error', new e.MongoDBError(error))
              return
            }
            response.end(pretty_json(links))
          })
        }
        break

      case 'POST':
        var posted_mime = request.headers['content-type']

        if (!posted_mime) {
          error_dispatch.emit('error', new e.HTTPPostContentTypeRequired(), 400)
          return
        }
        if (posted_mime !== config.JSON_MIME) {
          error_dispatch.emit('error', new e.HTTPPostContentTypeNotSupported(posted_mime), 415)
          return
        }

        body = ''
        request.on('readable', function() {
          while (chunk = request.read())
            body += chunk
        })
        request.on('end', function() {
          try {
            body = JSON.parse(body)
          }
          catch (error) {
            error_dispatch.emit('error',
              (error instanceof SyntaxError) ? new e.HTTPPostBodyError('Could not parse JSON.') : error)
            return
          }
          if (!body.title || !body.url) {
            error_dispatch.emit('error', new e.HTTPPostBodyError('Link title and URL are required.'))
            return
          }
          link = {
              title: body.title
            , url: body.url
          }
          models.Link.create(link, function(error, link) {
            if (error) {
              error_dispatch.emit('error', new e.MongoDBError('Could not save link: ' + error))
              return
            }
            response.statusCode = 201
            response.end(pretty_json(link))
          })
        })
        break

      default:
        error_dispatch.emit('error', new e.HTTPResourceMethodUnsupported(request.method))
        return
    }
  }
  else {
    error_dispatch.emit('error', new e.HTTPResourceDoesNotExist(request.url))
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