var fs = require('fs');
var config = require('./config.js');
var express = require('express');

var app = express();
if (config.publicFolder)
  app.use(express.static('public'))

var httpsRedirect = app;

app.get('/*', function (req, res) {
  res.writeHead(301, {
    "Location": config.mediumUrl + req.url
  });
  res.end();
});

if (config.https.privateKey && config.https.certificate) {
  var privateKey = fs.readFileSync(config.https.privateKey, 'utf8');
  var certificate = fs.readFileSync(config.https.certificate, 'utf8');

  var credentials = {
    key: privateKey,
    cert: certificate
  };

  var https = require('https');
  var httpPort = config.https.port || 443;
  https.createServer(credentials, app).listen(443);

  httpsRedirect = function (req, res) {
    res.writeHead(301, {
      "Location": config.mediumUrl + req.url
    });
    res.end();
  }
  
  console.log(`HTTPS proxy started on port ${httpPort}.`);
}

var http = require('http');
var httpPort = config.httpPort || 80;
http.createServer(httpsRedirect).listen(httpPort);

console.log(`HTTP proxy started on port ${httpPort}.`);
