var assert = require('assert')
  , config = require('../config')
  , e = require('../lib/errors')
  , api_request = require('./lib/api-request')
  , ObjectId = require('mongoose').Types.ObjectId
  , fixture_links

config.LISTEN_PORT = 3000

fixture_links = [
    { title: 'GitHub', url: 'http://www.github.com' }
  , { title: 'Stack Overflow', url: 'http://www.stackoverflow.com' }
  , { title: 'Mozilla Developer Network', url: 'https://developer.mozilla.org' }
]

describe('API: the `Links` resource:', function() {

  describe('POST:', function() {

    it('fails when the `Content-Type` request header is not present', function(done) {
      var opts
        , request

      opts = {
          port: config.LISTEN_PORT
        , path: '/links'
        , method: 'POST'
      }

      request = api_request(opts, function(response) {
        assert.strictEqual(
            response.headers['content-type']
          , 'application/json'
          , '`Content-Type` header is present and is `application/json`')

        assert.deepEqual(
            response.body
          , { error: (new e.HTTPPostContentTypeRequired).message }
          , 'The response is an `HTTPPostContentTypeRequired` message')

        assert.strictEqual(
            response.statusCode
          , 400
          , 'HTTP 400')

        done()
      })

      request.end()
    })

    it('fails when the `Content-Type` request header is not `application/json`', function(done) {
      var opts
        , request

      opts = {
          port: config.LISTEN_PORT
        , path: '/links'
        , method: 'POST'
        , headers: { 'Content-Type': 'text/plain'}
      }

      request = api_request(opts, function(response) {
        assert.strictEqual(
            response.headers['content-type']
          , 'application/json'
          , '`Content-Type` header is present and is `application/json`')

        assert.deepEqual(
            response.body
          , { error: (new e.HTTPPostContentTypeNotSupported(opts.headers['Content-Type'])).message }
          , 'The response body is an `HTTPPostContentTypeNotSupported` message')

        assert.strictEqual(
            response.statusCode
          , 415
          , 'HTTP 415')

        done()
      })

      request.write(JSON.stringify(fixture_links[0]))
      request.end()
    })

    it('gracefully handles invalid JSON', function(done) {
      var opts
        , request

      opts = {
          port: config.LISTEN_PORT
        , path: '/links'
        , method: 'POST'
        , headers: { 'Content-Type' : 'application/json' }
      }

      request = api_request(opts, function(response) {
        assert.strictEqual(
            response.headers['content-type']
          , 'application/json'
          , '`Content-Type` header is present and is `application/json`')

        assert.deepEqual(
            response.body
          , { error: (new e.HTTPPostBodyError('Could not parse JSON.')).message }
          , 'The response body is an `HTTPPostBodyError` message')

        assert.strictEqual(
            response.statusCode
          , 400
          , 'HTTP 400')

        done()
      })

      request.write('thisisnotvalidjson!!')
      request.end()
    })

    it('returns the newly created link object upon successful POST', function(done) {
      var opts

      opts = {
          port: config.LISTEN_PORT
        , path: '/links'
        , method: 'POST'
        , headers: { 'Content-Type' : 'application/json' }
      }

      fixture_links.forEach(function(fixture_link, index) {
        var request

        request = api_request(opts, function(response) {
          assert.strictEqual(
              response.headers['content-type']
            , 'application/json'
            , '`Content-Type` header is present and is `application/json`')

          // @todo returns location header

          assert(
              response.body._id
            , 'The response JSON includes an `_id` for the newly created Link object')

          // The API returns an `_id` and `__v` for the newly created Link object
          fixture_links[index]['_id'] = response.body['_id']
          fixture_links[index]['__v'] = response.body['__v']

          assert.deepEqual(
              response.body
            , fixture_links[index]
            , 'The response JSON is a representation of the created Link')

          assert.strictEqual(
              response.statusCode
            , 201
            , 'HTTP 201')

          if (index === fixture_links.length-1)
            done()
        })

        request.write(JSON.stringify(fixture_link))
        request.end()
      })
    })
  })

  describe('GET:', function() {
    it('should list all existing links when no query params or `_id` are specified', function(done) {
      var opts
        , request

      opts = {
          port: config.LISTEN_PORT
        , path: '/links'
        , method: 'GET'
      }

      request = api_request(opts, function(response) {
        assert.strictEqual(
            response.headers['content-type']
          , 'application/json'
          , '`Content-Type` header is present and is `application/json`')

        assert(Array.isArray(response.body)
          , 'The object is an array')

        assert.strictEqual(
            response.statusCode
          , 200
          , 'HTTP 200')

        //assert.strictEqual(
        //    body.length
        //  , fixture_links.length
        //)

        done()
      })

      request.end()
    })

    it('should return a single existing link requested by `_id`', function(done) {
      var requested_link = fixture_links[0]
        , opts
        , request

      opts = {
          port: config.LISTEN_PORT
        , path: '/links/' + requested_link._id
        , method: 'GET'
      }

      request = api_request(opts, function(response) {
        assert.strictEqual(
            response.headers['content-type']
          , 'application/json'
          , '`Content-Type` header is present and is `application/json`')

        assert.deepEqual(
            response.body
          , requested_link
          , '')

        assert.strictEqual(
            response.statusCode
          , 200
          , 'HTTP 200')

        done()
      })

      request.end()
    })

    it('should return a 404 when a non-existant link is requested', function(done) {
      var exists
        , _id
        , request
        , opts

      // Definitely get an `_id` that's not among those in `fixture_links`
      // This is overkill, ey?
      do {
        _id = ObjectId()
        exists = false
        fixture_links.forEach(function(link) {
          if (link._id === _id) exists = true
        })
      } while (exists)

      opts = {
          port: config.LISTEN_PORT
        , path: '/links/' + _id
        , method: 'GET' // @todo this is probably not required! :<
      }

      request = api_request(opts, function(response) {
        assert.strictEqual(
            response.headers['content-type']
          , 'application/json'
          , '`Content-Type` header is present and is `application/json`')

        assert.deepEqual(
            response.body
          , { error: (new e.HTTPEntityDoesNotExist('Link `' + _id + '`')).message }
          , '')

        assert.strictEqual(
            response.statusCode
          , 404
          , 'HTTP 404')

        done()
      })

      request.end()
    })
  })
})