[
  function MongoDBError(error) {
    this.name = 'MongoDBError'
    this.message = 'MongoDB error: ' + error
  }
, function HTTPPostBodyError(message) {
    this.name = 'HTTPPostBodyError'
    this.message = 'Bad POST parameters: ' + message
  }
, function HTTPPostContentTypeError(mime) {
    this.name = 'HTTPPostContentTypeError'
    this.message = 'Content type `' + mime + '` not supported for POST'
  }
, function HTTPResourceDoesNotExist(resource) {
    this.name = 'HTTPResourceDoesNotExist'
    this.message = 'Resource does not exist: ' + resource
  }
].forEach(function(exception) {
  exception.prototype = Error.prototype
  exports[exception.name] = exception
})