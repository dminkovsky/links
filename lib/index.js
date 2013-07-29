function pretty_json(object, include) {
  return JSON.stringify(object, include, 2)
}

exports.pretty_json = pretty_json