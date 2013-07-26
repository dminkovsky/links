var
    assert = require('assert')
  , config = require('../config')
  , e = require('../lib/exceptions')
  , api_request = require('./lib/api-request')

describe('POSTing a link to the API', function() {
  it('should throw a `HTTPPostContentTypeError` when `Content-Type` is not `application/json`', function(done) {
    var
        opts
      , request_end_cb
      , request

    opts = {
        port: config.LISTEN_PORT
      , path: '/links'
      , method: 'POST'
      , headers: { 'Content-Type' : ''}
    }

    request_end_cb = function(body) {
      assert.notStrictEqual(opts.headers['Content-Type'], config.JSON_MIME)
      assert.strictEqual(body, (new e.HTTPPostContentTypeError(opts.headers['Content-Type'])).message)
      done()
    }

    request = api_request(opts, request_end_cb)
    request.end()
  })

  it('should return the newly created link object when POSTed link is successfully created.', function(done) {
    var
        opts
      , link
      , request_end_cb
      , request,

    opts = {
        port: config.LISTEN_PORT
      , path: '/links'
      , method: 'POST'
      , headers: { 'Content-Type' : 'application/json'}
    }

    link = {
        title: 'GitHub'
      , url: 'http://www.github.com'
    }

    request_end_cb = function(body) {
      body = JSON.parse(body)
      assert.strictEqual(body.title, link.title)
      assert.strictEqual(body.url, link.url)
      done()
    }

    request = api_request(opts, request_end_cb)
    request.write(JSON.stringify(link))
    request.end()
  })
})