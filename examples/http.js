
var http = require('http');
var tidy = require('../htmltidy');

// setup options
var opts = {
  doctype: 'html5',
  indent: true,
  bare: true,
  breakBeforeBr: true,
  hideComments: true,
  fixUri: true,
  wrap: 0
};

var worker = tidy.createWorker(opts);

http.get({
  host: "www.yahoo.com",
  path: "/" },
  function (res) {
    res.pipe(worker).pipe(process.stdout);
  });
