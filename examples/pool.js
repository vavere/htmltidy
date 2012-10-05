var request = require('request');
var tidy = require('../htmltidy');

// demo pool
function Pool(opts, size) {
  var count = 0;
  var queue = [];

  function close() {
    count--;
    if (queue.length > 0)
      create(queue.shift());
  }  

  function create(cb) {
    count++;
    var worker = tidy.createWorker(opts);
    worker.on('close', close);
    cb(worker);
  }
  
  this.aquire = function(cb) {
    if (count < size)
      create(cb);
    else
      queue.push(cb);
  }
}

// released several requests with small time shift
// but using only 3 workers simultaneous
// help keep server resources under control

var QUEUE_SIZE = 3;

var TIDY_OPTS = {
  indent: true,
  breakBeforeBr: true,
  fixUri: true,
  wrap: 0
}

var pool = new Pool(TIDY_OPTS, QUEUE_SIZE);

var r = 1;
var a = 1;

function doRequest() {
    console.log('request started ' + r);
  if (r++ < 10) setTimeout(doRequest, 150);
    pool.aquire(function(worker) {
      console.log('worker aquired ' + a++);
      request.get('http://www.yahoo.com/').pipe(worker);
    });
}
doRequest();





