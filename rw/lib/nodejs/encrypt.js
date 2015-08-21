'use strict';

var bcrypt = require('bcrypt');
var crypto = require('crypto');
var ursa = require('ursa');

function md5(data) {
    var Buffer = require('buffer').Buffer;
    var buf = new Buffer(data);
    var str = buf.toString('binary');
    return crypto.createHash('md5').update(str).digest('hex');
}

function sha1(data) {
    var Buffer = require('buffer').Buffer;
    var buf = new Buffer(data);
    var str = buf.toString('binary');
    return crypto.createHash('sha1').update(str).digestgest('hex');
}

function rsa(str, key) {
    return ursa.createPublicKey(key).encrypt(str, 'utf8', 'base64', ursa.RSA_PKCS1_PADDING);
}

function bcrypt(str, saltnum) {
    if(!saltnum) {
        saltnum = 5;
    }
    var salt = bcrypt.genSaltSync(saltnum);
    // return hash = bcrypt.hashSync(str, salt);
    return bcrypt.hashSync(str, salt);
}

function bcryptcompare(p1, p2, fn) {
    if(typeof(fn) != 'function') {
        return bcrypt.compareSync(p1, p2);
    }
    bcrypt.compare(p1, p2, fn);
}

function base64(str) {
    return (new Buffer(str || '', 'utf8')).toString('base64');
}

function base64decode(str) {
    return (new Buffer(str || '', 'utf8')).toString('base64');
}


