var models = require('../models')
  , errors = require('../errors')
  , format = require('../format')


function LinksController(options) {
  this.server = options.server
  this.request = options.request
  this.response = options.response
}


LinksController.prototype.create = function() {
  var self = this
    , link = this.request.body

  if (!link.title || !link.url) {
    this.server.emit('request_error', {
        Error: errors.HTTPPostBodyError
      , message: 'Link title and URL are required.'
      , status_code: 400
      , response: this.response
    })
  }

  models.Link.create(link, function(error, link) {
    if (error) {
      // How do I write a test for this?
      self.server.emit('request_error', {
          Error: errors.MongoDBError
        , message: 'Could not save link: ' + error
        , status_code: 500
        , response: self.response
      })
      return
    }

    self.response.statusCode = 201
    self.response.end(format.json(link))
  })
}


LinksController.prototype.read = function() {
  var self = this
    , select_fields = ['title', 'url', '__v']
    , query_criteria

  // `/links/51f3ebcac355d07935000006`
  if (this.request.matches[1]) {
    query_criteria = {
        _id: request.matches[1]
    }

    models.Link.find(query_criteria, select_fields.join(' '), function(error, link) {
      if (error) {
        self.server.emit('request_error', {
            Error: errors.MongoDBError
          , message: error
          , status_code: 500
          , response: self.response
        })
        return
      }
      if (!link.length) {
        self.server.emit('request_error', {
            Error: errors.HTTPEntityDoesNotExist
          , message: 'Link `' + self.request.matches[1] + '`'
          , status_code: 404
          , response: self.response
        })
        return
      }
      if (link.length === 1) {
        self.response.end(format.json(link.pop()))
      }
      else {
        // How do I write a test for this?
      }
    })
  }

  // `/links?foo=bar`
  else if (path_matches[2]) {

  }

  // `/links`
  else {
    models.Link.find({}, select_fields.join(' '), function(error, links) {
      if (error) {
        self.server.emit('request_error', {
            Error: errors.MongoDBError
          , message: error
          , status_code: 500
          , response: self.response
        })
        return
      }
      response.end(format.json(links))
    })
  }
}


LinksController.prototype.update = function() {

}


LinksController.prototype.delete = function() {

}


module.exports = LinksController