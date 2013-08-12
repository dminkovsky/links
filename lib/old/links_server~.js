var http = require('http')
  , util = require('util')
  , mongoose = require('mongoose')
  , format = require('./format')
  , error = require('./error')
  , controllers = require('./controllers')
  , log = require('./logging')


function LinksServer() {
  var self = this
  http.Server.call(this, this.handle)

  this.resources = {
    links: {
        routes: /^\/links(?:(?:\/([0-9a-f]{24}))|(?:\?(.+)$))?$/
      , Controller: controllers.LinksController
    }
  }
}


util.inherits(LinksServer, http.Server)


LinksServer.prototype.route = function(request, response) {
  var self = this
    , resources = Object.keys(this.resources)
    , resource
    , matches
    , controller
    , request_mime
    , chunk

  for (var i; i < resources.length; i++) {
    resource = this.resources[resources[i]]

    if (matches = request.url.match(resource.routes)) {
      request.matches = matches

      controller = new resource.Controller({
          server: this
        , request: request
        , response: response
      })

      switch (request.method) {
        case 'POST':
          request_mime = request.headers['content-type'];

          if (!request_mime) {
            request.emit('request_error', {
                Error: error.HTTPPostContentTypeRequired
              , status_code: 400
            })
            return
          }

          if (request_mime !== this.config.JSON_MIME) {
            request.emit('request_error', {
                Error: error.HTTPPostContentTypeNotSupported
              , message: request_mime
              , status_code: 415
            })
            return
          }

          request.body = ''

          request.on('readable', function() {
            while (chunk = request.read()) request.body += chunk
          })

          function dispatch(controller) {
            return function() {
              try {
                request.body = JSON.parse(request.body)
              }
              catch (error) {
                request.emit('request_error', {
                    Error: error.HTTPPostBodyError
                  , message: 'Could not parse request body as JSON.'
                  , status_code: 400
                })
                return
              }

              controller.create(request, response)
            }
          }

          request.on('end', dispatch(controller))
          break

        case 'GET':
          controller.read()
          break

        case 'PUT':
          controller.update()
          break

        case 'DELETE':
          controller.delete()
          break
      }

      break
    }
  }

  return !!matches
}


LinksServer.prototype.handle = function(request, response) {
  request.on('request_error', function(options) {
    response.statusCode = options.status_code
    response.end(this.format_error({ 
        error: new options.Error(options.message)
    }))
  })
    
  response.setHeader('Content-Type', config.JSON_MIME)

  if (!this.route(request, response))
    request.emit('request_error', {
        Error: error.HTTPResourceDoesNotExist
      , message: request.url
      , status_code: 404
    })
}


LinksServer.prototype.start = function() {
  var self = this

  mongoose.connect(this.config.MONGOOSE_URL)

  mongoose.connection.on('error', function(error) {
    // @todo@ Determine whether `#info()` is the proper method for errors.
    log.fatal('MongoDB connection error: %s', error)
    process.exit(1)
  })

  mongoose.connection.once('open', function() {
    log.info('Connected to MongoDB at %s', self.config.MONGOOSE_URL)

    self.listen(self.config.LISTEN_PORT, function() {
      log.info('Listening for HTTP requests on port %d.', self.config.LISTEN_PORT)
    })
  })
}


LinksServer.prototype.stop = function() {
  var self = this

  mongoose.disconnect(function() {
    self.close(function() {
      log.info('Stopped listening on port %d', self.config.LISTEN_PORT)
      self.emit('stopped', self)
    })
  })
}

module.exports = LinksServer
