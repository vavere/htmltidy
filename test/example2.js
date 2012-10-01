
var tidy = require('../htmltidy').tidy;

var text = '<table><tr><td>badly formatted html</tr>';

// setup options
var opts = {
    'doctype':'html5',
    'quiet': true,
    'force-output':true,
    'tidy-mark':'n',
    'indent':true,
    'bare':true,
    'break-before-br':true,
    'hide-comments':true,
    'fix-uri':true,
    'wrap': 0
}
tidy(text, opts, function(err, html) { 
    console.log(html);
});

