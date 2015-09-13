var express = require('express');
var http = require('http');

var app = express();

app.use(express.static('.'));

var server = http.createServer(app);
server.listen(3000);