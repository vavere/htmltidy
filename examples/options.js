
var tidy = require('../htmltidy').tidy;

var text = '<table><tr><td>badly formatted html</tr>';

// setup options
var opts = {
  doctype: 'html5',
  indent: true,
  bare: true,
  breakBeforeBr: true,
  hideComments: true,
  fixUri: true,
  wrap: 0
}
tidy(text, opts, function(err, html) {
    console.log(html);
});

