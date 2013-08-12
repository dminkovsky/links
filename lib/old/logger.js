var bunyan = require('bunyan')
  , loggers = {}

function get_logger(config) {
  var logger

  if (logger = loggers[config.name])
    return logger

  loggers.push(bunyan.createLogger({
      name: config.name
    , stream: config.stream
  }))
}

exports.get_logger = get_logger
