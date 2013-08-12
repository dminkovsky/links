exports.json = function(options) {
  var object = options.object
    , replacer = options.replacer
    , spaces = options.spaces || 2

  return JSON.stringify(object, replacer, spaces)
}

exports.json_error = function(options) {
  var error = options.error

  return this.format_json({
    object: { error: error.message }
  })
}