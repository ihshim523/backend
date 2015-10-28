
var express = require('express');
var fs = require('fs');
var url = require("url");
var path = require("path");
var async = require('async');

String.prototype.hashCode = function() {
	for (var h = 0, i = 0; i < this.length;) {
		h = 31 * h + this.charCodeAt(i++);
	}
	return h.toString(16);
};
var esl = require('./EslServer/server.js');

esl.initTest();
