var test = require('tape')
  , error = require('../lib/error')

test('Config module', function(t) {
  var config

  t.doesNotThrow(
      function() {
        config = require('../lib/config')
      }
    , 'The `config` module exists.')

  t.equal(
      typeof config.init
    , 'function'
    , 'The `config` module exports an `.init()` function.')

  t.equal(
      typeof config.set
    , 'function'
    , 'The `config` module exports a `.set()` function.')

  t.equal(
      typeof config.get
    , 'function'
    , 'The `config` module exports a `.get()` function.')

  t.equal(
      typeof config.configured
    , 'function'
    , 'The `config` module exports a `.configured()` function.')

  t.equal(
      config.get
    , config
    , '`.get()` is an alias for the root export.')

  t.equal(
      config.configured()
    , false
    , '`.configured()` before `.init()` returns `false`.')

  t.throws(
      function() {
        var a = config.set('some_var')
      }
    , '`.set()` before `.init()` throws an `Error`.')

  t.throws(
      function() {
        var a = config.get('some_var')
      }
    , '`.get()` before `.init()` throws an `Error`.')

  var configuration = {
      'some': 'setting'
    , 'another': {
          'deeper': 'option'
      }
  }

  config.init(configuration)

  t.equal(
      config.configured()
    , true
    , '`.configured()` after `.init()` returns `true`.')

  // Test `.get()`
  t.deepEqual(
      config.get()
    , configuration
    , '`.get()` with no arguments returns the entire configuration')

  // Test `.get([])`
  t.deepEqual(
      config.get([])
    , configuration
    , '`.get([]) returns the entire configuration')

  // Test `.get(String)`
  t.equal(
      config.get('some')
    , configuration['some'] 
    , '`.get(String)` retrieves settings by root-level key.')

  // Test `.get(Array)`
  t.equal(
      config.get(['another', 'deeper'])
    , configuration['another']['deeper'] 
    , '`.get(Array)` retrieves settings by path.')

  // Test `.set(String, value)`
  t.equal(
      config.set('some', 'thing else')
    , config
    , '.`set(String)` returns the root export')

  t.equal(
      config.get('some')
    , 'thing else'
    , '`.set(String)` assigns settings by root-level key.')

  // Test `.set(Array, value)`
  t.equal(
      config.set(['another', 'deeper'], 'value')
    , config
    , '`.set(Array)` returns the root export')

  t.equal(
      config.get(['another', 'deeper'])
    , 'value'
    , '`.set(Array)` assigns settings by path')

  configuration = {
      'some': {
          'other': 'configuration'
      }
  }

  config.set([], configuration)

  t.deepEqual(
      config.get()
    , configuration
    , '`.set([], value)` replaces the entire configuration with `value`')

  t.end()
})
