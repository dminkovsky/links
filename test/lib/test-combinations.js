var test = require('tape')
  , equal = require('deep-equal')
  , combinations = require('./combinations')

test('combinations.str(): Substring combinations of \'abc\'', function(t) {
  var actual = combinations.str('abc')
    , expected = ['abc', 'ab', 'ac', 'a', 'bc', 'b', 'c'] 

  t.equal(
      actual.length
    , expected.length
    , 'Actual and expected are the same length')

  expected.forEach(function(combo) {
    t.ok(
        actual.indexOf(combo) >= 0
      , 'Expected combo "' + combo + '" among actually generated combinations')
  })

  t.end()
})

test('combinations.arr(): Subset combinations of [\'a\', \'b\', \'c\']', function(t) {
  var actual = combinations.arr(['a', 'b', 'c'])
   , expected = [['a', 'b', 'c'], ['a', 'b'], ['a', 'c'], ['a'], ['b', 'c'], ['b'], ['c']] 

  t.equal(
      actual.length
    , expected.length
    , 'Actual and expected are the same length')

  expected.forEach(function(expected_combo) {
    var found = 0
    actual.forEach(function(actual_combo) { if (equal(actual_combo, expected_combo)) found++ })
    if (found === 1) t.pass('Expected combo "' + expected_combo + '" among actually genererated combinations')
  })

  t.end()
})
