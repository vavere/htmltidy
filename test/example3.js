
var http = require('http');
var tidy = require('../htmltidy');

// setup options
var opts = {
    'doctype':'html5',
    'quiet': true,
    'force-output':true,
    'tidy-mark':false,
    'indent':true,
    'bare':true,
    'break-before-br':true,
    'hide-comments':true,
    'fix-uri':true,
    'wrap': 0
}
http.get({ 
  host: "www.delfi.lv", 
  path: "/" },
  function(res) {
    var worker = tidy.createWorker(opts);
    res.pipe(worker).pipe(process.stdout); 
  });

//var options = {
//  host: 'www.ma-1.lv',
//  path: '/'
//};
//
//callback = function(response) {
//  var str = '';
//
//  //another chunk of data has been recieved, so append it to `str`
//  response.on('data', function (chunk) {
//    str += chunk;
//  });
//
//  //the whole response has been recieved, so we just print it out here
//  response.on('end', function () {
//    console.log(str);
//  });
//}
//
//var tidy = new HtmlTidy();
//tidy.open();
//http.request(options).pipe(tidy);


//var text = '<table><tr><td>badly formatted html</tr>';
//

//tidy(text, opts, function(err, html) { 
//    console.log(html);
//});

