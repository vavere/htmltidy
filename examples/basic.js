
var tidy = require('../htmltidy').tidy;

var text = '<table><tr><td>badly formatted html</tr>';

// default options
tidy(text, function(err, html) {
  // If the user has enabled warning messages, show them.
  if(err){
    console.log(err);
  }
  
  console.log(html);
});



