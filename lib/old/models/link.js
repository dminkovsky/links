var mongoose = require('mongoose')

module.exports = mongoose.model('Link', mongoose.Schema({
    title: String
  , url: String
}))