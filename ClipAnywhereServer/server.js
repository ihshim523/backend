#!/bin/env node

var server  = function(req, res, next) {
    res.send('test');
    next();
}; 

module.exports.server = server;
