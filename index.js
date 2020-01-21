var fs = require('fs');
var config = require('./config.js');
var request = require('request');
var express = require('express');
var serve = undefined;

var app = express();

if (config.public.folder && config.public.fileTypes) {
  let serveStatic = require('serve-static');
  serve = serveStatic(config.public.folder);
}

var httpsRedirect = app;

var redirect = (location, res) => {
  res.writeHead(301, {
    "Location": location
  });
  res.end();
}

var redirectMedium = (req, res) => {
  let location = config.mediumUrl + req.url;

  if (config.searchUserName) {
    request(location, (error, response, _) => {
      let searchLocation = 'https://medium.com/search?q=' + config.searchUserName + req.url;

      if (!error) {
        if (response.statusCode == 200)
          redirect(location, res);
        else
          redirect(searchLocation, res);
      } else
        redirect(searchLocation, res);
    });
  }
  else
    redirect(location, res);
}

app.get('/*', function (req, res) {
  if (config.public.folder && config.public.fileTypes) {
    let hasExtension = false;
    config.public.fileTypes.forEach(element => {
      if (!hasExtension && req.url.endsWith(element))
        hasExtension = true;
    });
    if (hasExtension)
      return serve(req, res, () => {
        redirectMedium(req, res);
      });
  }

  redirectMedium(req, res);
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
