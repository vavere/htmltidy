var Stream = require('stream').Stream;
var inherits = require('util').inherits;
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

// tidy exit codes
var TIDY_OK = 0;
var TIDY_WARN = 1;
var TIDY_ERR = 2;

// default tidy opts
var DEFFAUL_OPTS = {
  showWarnings: false,
  tidyMark: false,
  forceOutput: true,
  quiet: true
  }

// choose suitable executable
var tidyExec = chooseExec();

function TidyWorker(opts) {
  Stream.call(this);
  this.writable= true;
  this.readable= true;
  this._worker = spawn(tidyExec, parseOpts(merge(opts, DEFFAUL_OPTS)));
  var self = this;
  var errors = '';
  this._worker.stdin.on('drain', function () {
    self.emit('drain');
  });
  this._worker.stdin.on('error', function () {
    self.emit('error');
  });
  this._worker.stdout.on('data', function (data) {
    self.emit('data', data);
  });
  this._worker.stdout.on('close', function (data) {
    self.emit('close');
  });
  this._worker.stderr.on('data', function (data) {
    errors+= data;
  });
  this._worker.on('exit', function (code) {
    if (code > TIDY_WARN)
      self.emit('error', errors);
    self.emit('end');
  });
}

inherits(TidyWorker, Stream);

TidyWorker.prototype.write = function (data) {
  if (!this._worker)
    throw new Error('worker has been destroyed');
  return this._worker.stdin.write(data);
}

TidyWorker.prototype.end = function (data) {
  if (!this._worker)
    throw new Error('worker has been destroyed');
  this._worker.stdin.end(data);
}

TidyWorker.prototype.pause  = function () {
  if (!this._worker)
    throw new Error('worker has been destroyed');
  if (this._worker.stdout.pause)
    this._worker.stdout.pause();
}

TidyWorker.prototype.resume  = function () {
  if (!this._worker)
    throw new Error('worker has been destroyed');
  if (this._worker.stdout.resume)
    this._worker.stdout.resume();
}

TidyWorker.prototype.destory = function () {
  if (this._worker)
    return;
  this._worker.kill();
  this._worker= null;
  self.emit('close');
}

function createWorker(opts) {
  return new TidyWorker(opts);
}

function tidy(text, opts, cb) {
  // options are optional
  if (typeof opts == 'function') {
    cb = opts;
    opts = {};
  }
  if (typeof cb != 'function')
    throw new Error('no callback provided for tidy');

  var tidy = new TidyWorker(opts);
  var result = '';
  var error = '';
  tidy.on('data', function (data) {
    result+= data;
  });
  tidy.on('error', function (data) {
    error+= data;
  });
  tidy.on('end', function (code) {
    cb(error, result);
  });
  tidy.end(text);
}

function chooseExec() {
  var tidyExe;
  switch (process.platform) {
    case 'win32':
      tidyExe = path.join('win32','tidy.exe');
      break;
    case 'linux':
      tidyExe = path.join('linux', 'tidy');
      break;
  	case 'darwin':
	    tidyExe = path.join('darwin', 'tidy');
	    break;
    default:
        throw new Error('unsupported execution platform');
  }
  tidyExe = path.join(__dirname, 'bin', tidyExe);

  var existsSync = fs.existsSync||path.existsSync; // node > 0.6
  if (!existsSync(tidyExe))
      throw new Error('missing tidy executable: ' + tidyExe);
  return tidyExe;
}

function parseOpts(opts) {
  opts = opts || {};
  var args = [];
  for (var n in opts) {
    args.push('--' + toHyphens(n));
    switch (typeof opts[n]) {
      case 'string':
      case 'number':
        args.push(opts[n]);
        break;
      case 'boolean':
        args.push(opts[n]? 'yes': 'no');
        break;
      default:
        throw new Error('unknown option type');
    }
  }
  return args;
}

function toHyphens(str) {
    return str.replace(/([A-Z])/g, function (m, w) { return '-' + w; });
}

/**
 * Overwrites obj2's values with obj1's and adds obj2's if non existent in obj2
 * @param obj1
 * @param obj2
 * @returns a new object based on obj1 and obj2
 */
function merge(obj1, obj2) {
  obj1 = obj1 || {};
  obj2 = obj2 || {};
  var obj3 = {};
  for (var attrname in obj2) obj3[attrname] = obj2[attrname];
  for (var attrname in obj1) obj3[attrname] = obj1[attrname];
  return obj3;
}

exports.createWorker = createWorker;
exports.tidy = tidy;
