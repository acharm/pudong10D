'use strict';

var fs = require('fs');
var path = require('path');

module.exports.pwd = pwd;
module.exports.readbyline = readbyline;
module.exports.pipeFile = pipeFile;

function pwd() {
    return path.resolve('.');
}

function readbyline (filename, fn, fn2) {
    
    var liner = new stream.Transform( { objectMode: true } );
    liner._transform = function (chunk, encoding, done) {
        var data = chunk.toString();
        if (this._lastLineData) {
            data = this._lastLineData + data;
        }
        
        var lines = data.split(/[\n\r]+/);
        this._lastLineData = lines.splice(lines.length - 1, 1)[0];
        
        lines.forEach(this.push.bind(this));
        done();
    }

    liner._flush = function (done) {
        if(this._lastLineData) {
            this.push(this._lastLineData);
        }
        this._lastLineData = null;
        done();
    }

    var source = fs.createReadStream(filename);
    source.pipe(liner);
    // fs.readSync(fd, buffer,
    var lineno = 0;
    liner.on('readable', function() {
        var line;
        var donext = true;
        while (line = liner.read()) {
            lineno++;
            donext = fn(line, lineno);
        }
    });
    liner.on('end', function() {
        fn2(lineno);
    });
}

function pipeFile(stream, fname, fn) {
    stream.pipe(fs.createWriteStream(fname));
    stream.once('finish', function() {
        fs.fsyncSync(stream.fd);
    });
    stream.once('close', fn);
}


function readJSON(file) {
    if(fs.existsSync(file)) {
        try {
            return JSON.parse(fs.readFileSync(file));
        }catch(e) {
            console.error(file + ' is not a valid JSON file');
            console.error(e.stack);
            return null;
        }
    }else {
        console.error(file + ' not exist');
        console.trace();
        return null;
    }
}

function readString(file) {
    if(fs.existsSync(file)) {
        try{
            return fs.readFileSync(file).toString();
        }catch(e) {
            console.error(file + ' is not a valid file');
            console.trace();
            return '';
        }
    }else {
        console.error(file + 'not exist');
        console.trace();
        return '';
    }
}

function isExec(file) {
    var stat = fs.statSync(file);
    return (stat.mode & parseInt('0001', 8));
}

function isSymbolicLink(file) {
    var stat = fs.lstatSync
}


