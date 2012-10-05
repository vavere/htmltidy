var request = require('request');
var tidy = require('../htmltidy');

// demo pool
function Pool(opts, size) {
  var count = 0;
  var queue = [];

  function create(cb) {
    count++;
    var worker = tidy.createWorker(opts);
    worker.on('close', function () {
      count--;
      if (queue.length > 0)
        create(queue.shift());
    });
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

var r = 0;
var a = 0;

function doRequest() {
  if (r++ < 10) setTimeout(doRequest, 150);
    console.log('request started ' + r);
    pool.aquire(function(worker) {
      console.log('worker aquired ' + a++);
      request.get('http://www.yahoo.com/').pipe(worker);
    });
}
doRequest();





