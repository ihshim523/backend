var elasticsearch = require('elasticsearch');
var db = new elasticsearch.Client({
  host:['https://site:22d3ca5fb355b3ac1d9fb1b968921037@bofur-us-east-1.searchly.com']
});

module.exports = db;
