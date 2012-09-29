var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

var tidyExeRel;

switch (process.platform) {
    case 'win32':
        tidyExeRel = path.join('bin', 'tidy.exe');
        break;
    case 'linux':
        tidyExeRel = path.join('bin', 'tidy');;
        break;
    default: // compatibility
        log("tidy can only operate on linux and windows");    
        process.exit(1);    
        return;
}

var tidyExeAbs = path.join(__dirname, tidyExeRel);

// compatibility
var existsSync = fs.existsSync||path.existsSync;

if (!existsSync(tidyExeAbs)) {
    log('missing tidy executable: ' + tidyExeRel);    
    process.exit(2);    
    return;
}

function tidy(str, callback) {
    var buffer = '';
        var error = '';

    if (!callback) {
        throw new Error('No callback provided for tidy.html');
    }
    var ptidy = spawn(tidyExeAbs,
        [
            '--doctype','html5',
            '--quiet','y',
            '--force-output','y',
            '--tidy-mark','n',
            '--indent','y',
            '--bare','y',
            '--break-before-br','y',
            '--hide-comments','y',
            '--fix-uri','y',
            '--wrap','0'
        ]);

    ptidy.stdout.on('data', function (data) {
        buffer += data;
    });

    ptidy.stderr.on('data', function (data) {
        error += data;
    });

    ptidy.on('exit', function (code) {
        //fs.writeFileSync('last_tidy.html', buffer, 'binary');
        callback(buffer);
    });

    ptidy.stdin.write(str);
    ptidy.stdin.end();      
}

exports.tidy = tidy;