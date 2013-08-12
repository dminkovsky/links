var test = require('tape')
  , errors = require('../lib/errors')
  , config = require('./config')

test('LinksServer module', function(t) {
  var links_server
    , LinksServer 

  t.doesNotThrow(
      function() {
        LinksServer = require('../lib/links_server')
      }
    , 'The `links_server` module exists.')

  t.equal(
      typeof LinksServer
    , 'function'
    , 'The `links_server` module exports a function.')

  links_server = new LinksServer(config)

  t.ok(
      links_server instanceof LinksServer &&
        links_server instanceof require('http').Server
    , 'The function constructs an instance of `LinksServer` which is an instanceof `http.Server`.')

  t.throws(
      function() {
        new LinksServer()
      }
    , new errors.ConfigurationError('`LinkServer` constructed without a valid configuration')
    , 'The constructor throws an error when invoked without a valid configuration.')

  t.end()
})

test('LinksServer control', function(t) {
  var LinksServer = require('../lib/links_server')
    , links_server = new LinksServer(config);

  links_server.on('listening', function() {
    t.pass('LinksServer is listening.')

    links_server.on('stopped', function() {
      t.pass('LinksServer stopped listening.')
      t.end()
    })

    links_server.stop()
  })

  links_server.start()
})
