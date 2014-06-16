#!/bin/env node

var fs = require('fs');
var zlib = require('zlib');

var get = function(req, res, next) {
    next();
};

var post = function(req, res, next) {
    zlib.deflateRaw(req.body.k, function(err, output) {
        fs.writeFile('./HotIssue/get.dat', output, function(err) {
            res.send('{"R":"1"}');
        });
    });
};

var del = function(req, res, next) {
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
