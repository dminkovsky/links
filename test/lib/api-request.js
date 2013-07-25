var http = require('http')

function api_request(opts, end_cb) {
  return http.request(opts, function(response) {
    var body = ''
    response.on('readable', function() {
      var chunk
      while (chunk = response.read())
        body += chunk
    })
    response.on('end', function() {
      end_cb.call(this, body)
    })
  })
}

module.exports = api_request