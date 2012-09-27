
var tidy=require('./tidy.js').tidy;

tidy('<table><tr><td>badly formatted html</tr>', function(html) { 
    console.log(html); 
});