module.exports = {
    LISTEN_PORT: process.argv[2] || process.env.LISTEN_PORT || 3000
  , MONGOOSE_URL: 'mongodb://localhost/links'
  , JSON_MIME: 'application/json'
}

