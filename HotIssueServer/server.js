#!/bin/env node
var fs = require('fs');
var zlib = require('zlibjs');

var get = function(req, res, next) {
    next();
};

var post = function(req, res, next) {
    var buffer = new Buffer(req.body.k);
    var compressed = zlib.deflateSync(buffer);

    try {
        fs.writeFile('./HotIssue/get.dat', compressed, function(err) {
            var buffer = new Buffer(req.body.e, 'base64');
            fs.writeFile('./HotIssue/get2.dat', buffer, function(err) {
                res.send('{"R":"1"}');
            });
        });
    }
    catch(e) {
        next();
    }
};

var del = function(req, res, next) {
    next();
};

var server  = function(req, res, next) {
    switch(req.method) {
        case 'GET':
            next();
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
