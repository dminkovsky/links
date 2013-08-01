var error = require('./error.js')
  , config = {}
  , configured = false

function descend(obj, path, value) {
  var current

  current = obj

  for (var i = 0; i < path.length-1; i++) {
    current = current[path[i]]
  }

  if (value)
    current[path[path.length-1]] = value

  return current[path[path.length-1]]
}

function get(key) {
  if (!configured) {
    throw new error.ConfigurationError('Configuration must be initialized before calling `.get()`')
  }
  
  if (!key)
    return config

  if (typeof key === 'string')
    return config[key]
  
  if (Array.isArray(key))
    return (key.length) ? descend(config, key) : config
}

get.get = get

get.set = function(key, value) {
  if (!configured) {
    throw new error.ConfigurationError('Configuration must be initialized before calling `.set()`')
  }

  if (typeof key === 'string')
    config[key] = value

  else if (Array.isArray(key)) 
    (key.length) ? descend(config, key, value) : this.init(value)

  return this
}

get.init = function(c) {
  config = c
  configured = true
}

get.configured = function() {
  return configured
}


module.exports = get
