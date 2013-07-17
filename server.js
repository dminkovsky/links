var fs = require('fs');
var path = require('path');
var views = require('./lib/views');
var express = require('express');
var app = new express();
app.disable('x-powered-by');

var opts = {
    listen_port: process.env.LISTEN_PORT || 3000
  , media_path: process.env.MEDIA_PATH || __dirname + '/media'
}

app.use(function(req, res, next) {
  console.log('wtf');
  next();
});

app.get(/^\/favicon\.ico$/, function(req, res){
  res.status(404).send();
});


app.get(/^\/.*/, function(req, res) {
  var media_path = opts.media_path + req.path;

  fs.readdir(media_path, function(err, files) {
    if (err) {
      console.log(err);
      res.status(404).send('');
      return;
    }

    var page_view = (new views.Page());
    page_view
      .destination(res)
      .render({
        'current_path': req.path
      });

    res.end();
  });
});

app.listen(opts.listen_port);
