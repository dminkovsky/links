var fs = require('fs');
var path = require('path');
var hyperspace = require('hyperspace');


var View = function() {
  this.html = fs.readFileSync(path.join(__dirname, 'page.html'));

  this.hs = hyperspace(this.html, function(row) {
    return {
      '.current-path': row.current_path
    }
  });
};

View.prototype.destination = function(destination) {
  this.hs.pipe(destination);

  return this;
};

View.prototype.render = function(context) {
  var string = (typeof context == 'object') ? JSON.stringify(context) : context;
  this.hs.write(string);
  return this;
};

module.exports = View;