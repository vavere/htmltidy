var spawn = require('child_process').spawn;
var fs = require('fs');

function tidy(str, callback) {
    var buffer = '';
    var error = '';

    if (!callback) {
        throw new Error('No callback provided for tidy.html');
    }
    var ptidy = spawn(
        'tidy',
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