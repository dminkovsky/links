var
    assert = require('assert')
  , config = require('../config')
  , e = require('../lib/exceptions')
  , api_request = require('./lib/api-request')
  , opts
  , request

opts = {
    port: 3001
  , path: '/links'
  , method: 'POST'
  , headers: {}
}


// Test:
// ------------------------------------------------------------------------
// `HTTPPostContentTypeError` when Content-Type is not `'application/json'`
// ========================================================================
request = api_request(opts, function(body) {
  assert.notStrictEqual(
      opts.headers['Content-Type']
    , config.JSON_MIME
  )

  assert.strictEqual(
      body
    , (new e.HTTPPostContentTypeError(opts.headers['Content-Type'])).message
    , "`HTTPPostContentTypeError` when POSTing and Content-Type is not `'application/json'`"
  )
})
request.end()


// Test:
// ---------------------------------------------------------
// Creating a new link returns the newly created link object
// =========================================================
/*
request = api_request(opts, function() {
  var error = HTTPPostContentTypeError(config.JSON_MIME)
  assert.strictEqual(body, error.message)
})
request.write(JSON.stringify({
    title: 'GitHub'
  , url: 'http://www.github.com'
}))
request.end()
*/