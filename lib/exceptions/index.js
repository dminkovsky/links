[
  
  function MongoDBError(error) {
    this.name = 'MongoDBError'
    this.message = 'MongoDB error: ' + error
  }

, function HTTPPostBodyError(message) {
    this.name = 'HTTPPostBodyError'
    this.message = 'Bad POST parameters: ' + message + '.'
  }

, function HTTPPostContentTypeError(mime) {
    this.name = 'HTTPPostContentTypeError'
    this.message = 'POSTing with `Content-Type` `' + mime + '` is not supported.'
  }
, function HTTPResourceDoesNotExist(resource) {
    this.name = 'HTTPResourceDoesNotExist'
    this.message = 'Resource does not exist: ' + resource + '.'
  }

].forEach(function(exception) {
  exception.prototype = Error.prototype
  exports[exception.name] = exception
})