#!/bin/env node

var fs = require('fs');
var lz4 = require('lz4');

get = function(req, res, next) {
    next();
};

post = function(req, res, next) {

    var str = parseString(req.body.k);
    var input = new Buffer(str);
    var output = fs.createWriteStream('../HotIssue/get.dat');
    var encoder = lz4.createEncoderStream();
    
    input.pipe(encoder).pipe(output);
    
    res.send('{"R":"1"}');
};

del = function(req, res, next) {
    next();
};

var server  = function(req, res, next) {
    switch(req.method) {
        case 'GET':
            break;
        case 'POST':
            post(req,res,next);
            break;
        case 'DELETE':
            del(req,res,next);
            break;
    }
}; 

module.exports.server = server;
