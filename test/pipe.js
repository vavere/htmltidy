
var request = require('request');
var tidy = require('../htmltidy');

var opts = {
    indent: true,
    breakBeforeBr: true,
    fixUri: true,
    wrap: 0
}

var worker = tidy.createWorker(opts);
request.get('http://www.delfi.lv').pipe(worker).pipe(process.stdout);
