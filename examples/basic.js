
var tidy = require('../htmltidy').tidy;

var text = '<table><tr><td>badly formatted html</tr>';

// default options
tidy(text, function(err, html) {
    console.log(html);
});



