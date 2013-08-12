var test = require('tape')

// Integration tests
test('Config module', function(t) {
  var Config
  
  t.doesNotThrow(
      function() {
        Config = require('../lib/config')
      }
    , 'The `config` module exists')

  t.equal(
      typeof Config
    , 'function'
    , 'The `config` module exports a function')

  t.end()
})


test('Config constructor', function(t) {
  var Config = require('../lib/config')
    , path_to_config = 'a string'

  Config.prototype.load = function(path) {
    t.equal(
        path
      , path_to_config
      , 'The constructor calls `Config.prototype.load` with its first parameter.')
  }

  config = new Config(path_to_config)
})
