
var request = require('request');
var tidy = require('../htmltidy');

// setup options
var opts = {
    'indent':true,
    'break-before-br':true,
    'fix-uri':true,
    'wrap': 0
}

var worker= tidy.createWorker(opts);
request.get("http://www.nodejs.org").pipe(worker).pipe(process.stdout); 
