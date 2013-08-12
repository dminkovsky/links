var test = require('tape')
  , config = require('../lib/

test('Logging module', function(t) {
  var logging

  t.doesNotThrow(
      function() {
        logging = require('../lib/logging')
      }
      'The `logging` module exists and can be imported'
  )

  t.skip(
      function() {
        logger = Logger({ name: 'Links' })
      }
    , ''
  )

  t.end()
})
