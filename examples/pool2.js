var request = require('request');
var tidy = require('../htmltidy').tidy;
var queue = require('async').queue;


function Pool(opts, size) {

  function worker(text, cb) {
    tidy(text, opts, cb);
  }

  var q = queue(worker, size);

  this.tidy = function(text, cb) {
    q.push(text, cb);
  };

 Object.defineProperty(this, 'length', {
    get : function() { return q.length(); }
  });

}

// released several requests with small time shift
// but using only 3 workers simultaneous
// help keep server resources under control

var QUEUE_SIZE = 2;

var TIDY_OPTS = {
  indent: true,
  breakBeforeBr: true,
  fixUri: true,
  wrap: 0
};

var pool = new Pool(TIDY_OPTS, QUEUE_SIZE);

var r = 1;
var a = 1;

function doRequest() {

console.log('request ' + r + ' started');
  if (r++ < 10) setTimeout(doRequest, 40);

  request('http://www.delfi.lv', function (error, response, body) {
    pool.tidy(body, function(err, res) {
      console.log('request ' +  a++ + ' cleaned');
      console.log('queue size ' + pool.length);
    });
  });
}

doRequest();