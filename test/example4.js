
var request = require('request');
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

var worker= tidy.createWorker(opts);
request.get("http://www.github.com").pipe(worker).pipe(process.stdout); 
