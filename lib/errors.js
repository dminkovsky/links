var pretty_json = require('./').pretty_json
  , errors

function error_json(message) {
  return pretty_json({ 'error': message })
}

exports.error_json = error_json;

errors = [
    function MongoDBError(error) {
      this.name = 'MongoDBError'
      this.message = 'MongoDB error: ' + error
    }

  , function HTTPResourceMethodUnsupported(method) {
      this.name = 'HTTPResourceMethodUnsupported'
      this.message = 'HTTP Method ' + method + ' not supported for this resource.'
    }

  , function HTTPPostBodyError(message) {
      this.name = 'HTTPPostBodyError'
      this.message = 'Bad POST body: ' + message
    }

  , function HTTPPostContentTypeRequired() {
      this.name = 'HTTPPostContentTypeRequired'
      this.message = 'POST requires `Content-Type` to be specified.'
    }

  , function HTTPPostContentTypeNotSupported(mime) {
      this.name = 'HTTPPostContentTypeNotSupported'
      this.message = "POST with `Content-Type` `'" + mime + "'` is not supported."
    }

  , function HTTPResourceDoesNotExist(resource) {
      this.name = 'HTTPResourceDoesNotExist'
      this.message = 'Resource does not exist: ' + resource
    }

  , function HTTPEntityDoesNotExist(entity) {
      this.name = 'HTTPEntityDoesNotExist'
      this.message = 'Entity does not exist: ' + entity
    }
]

errors.forEach(function(error) {
  error.prototype = Error.prototype
  exports[error.name] = error
})
