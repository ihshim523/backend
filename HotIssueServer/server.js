#!/bin/env node

var fs = require('fs');
var lz4 = require('lz4');

get = function(req, res, next) {
    next();
};

post = function(req, res, next) {
    var input = new Buffer(req.body.k, 'utf-8');
    var output =lz4.encode(input);
    fs.writeFile('../HotIssue/get.dat', output, function() {
        res.send('{"R":"1"}');
    });
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
