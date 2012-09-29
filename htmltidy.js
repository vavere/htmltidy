var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

var tidyExe;

switch (process.platform) {
    case 'win32':
        tidyExe = 'tidy.exe';
        break;
    case 'linux':
        tidyExe = 'tidy';
        break;
    default: // unknown
        log("tidy can only operate on linux and windows");    
        process.exit(1);    
        return;
}

tidyExe = path.join(__dirname, 'bin', tidyExe);

// compatibility
var existsSync = fs.existsSync||path.existsSync;

if (!existsSync(tidyExe)) {
    log('missing tidy executable: ' + tidyExe);    
    process.exit(2);    
    return;
}

function tidy(text, opts, cb) {
    var result = '';
    var error = '';
    
    if (typeof opts == "function")
        cb = opts;
    
    if (!cb) {
        throw new Error('no callback provided for tidy');
    }
    
    var args = [];
    for (var n in opts) {
        args.push('--' + n);
        switch (typeof opts[n]) {
            case 'string':
            case 'number':
                args.push(opts[n]);
                break;
            case 'boolean':
                args.push(opts[n]?'yes':'no');
                break;
            default:
                throw new Error('unknown option type');
        }
    }
    var ptidy = spawn(tidyExe, args);

    ptidy.stdout.on('data', function (data) {
        result+= data;
    });

    ptidy.stderr.on('data', function (data) {
        error+= data;
    });

    ptidy.on('exit', function (code) {
        cb(error, result);
    });

    ptidy.stdin.write(text);
    ptidy.stdin.end();      
}

exports.tidy = tidy;