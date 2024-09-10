import fs from 'fs';
import {config} from './config.js';
import fetch from 'node-fetch';
import express from 'express';
import http from 'http';
import puppeteer from "puppeteer";

let serve = undefined;

const app = express();

if (config.public.folder && config.public.fileTypes) {
  import('serve-static')
    .then(serveStatic => {
      serve = serveStatic.default(config.public.folder);
    })
    .catch(err => console.error('Error loading serve-static:', err));
}

let httpsRedirect = app;

const redirect = (location, res) => {
  res.writeHead(301, {
    "Location": location
  });
  res.end();
}

const redirectMedium = async (req, res) => {
  let location = config.mediumUrl + req.url;
  console.log("location:", location);

  if (config.searchUserName) {
    console.log("username:", config.searchUserName);
    try {
      const response = await fetch(location);
      const body = await response.text();
      if (body.includes('<span class="ck">404</span>')) {
        console.log("searching medium");
        await mediumSearch(req, res);
      } else {
        console.log("redirecting to location");
        redirect(location, res);
      }
    } catch (error) {
      console.log("error:", error, "searching medium");
      await mediumSearch(req, res);
    }
  } else {
    console.log("no username");
    redirect(location, res);
  }
}

const mediumSearch = async (req, res) => {
  const lowerUserName = config.searchUserName.toLowerCase();
  const searchLocation = 'https://medium.com/' + lowerUserName + '/search?q=' + encodeURIComponent(req.url);
  console.log("searchLocation:", searchLocation);

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(searchLocation, {waitUntil: 'domcontentloaded'});

    const resultsSelector = 'article[class=""]';
    await page.waitForSelector(resultsSelector, {timeout: 3000});

    const body = await page.content();
    browser.close();

    const linkRegex = new RegExp(`<a[^>]+href="(/${lowerUserName}/[^/]+-[a-z0-9]{12})(\\?source=search_post[^"]*)?"[^>]*>`, 'i');
    const match = body.match(linkRegex);
    if (match && match[1]) {
      const location = 'https://medium.com/' + lowerUserName + '/' + match[1].split('-').pop();
      console.log("location:", location);
      redirect(location, res);
    } else {
      console.log("not found, redirecting", searchLocation);
      redirect(searchLocation, res);
    }
  } catch (error) {
    console.error('error searching medium:', error.message);
    redirect(searchLocation, res);
  }
};

app.use(async function (req, res) {
  if (config.public.folder && config.public.fileTypes) {
    console.log("theres static");
    let hasExtension = false;
    config.public.fileTypes.forEach(element => {
      if (!hasExtension && req.url.endsWith(element))
        console.log("theres extension:", element);
      hasExtension = true;
    });
    if (hasExtension)
      console.log("serving");
    return serve(req, res, () => {
      console.log("redirecting medium 1");
      redirectMedium(req, res);
    });
  }
  console.log("redirecting medium 2");

  await redirectMedium(req, res);
});

if (config.https.privateKey && config.https.certificate) {
  const privateKey = fs.readFileSync(config.https.privateKey, 'utf8');
  const certificate = fs.readFileSync(config.https.certificate, 'utf8');

  const credentials = {
    key: privateKey,
    cert: certificate
  };

  const https = require('https');
  const httpPort = config.https.port || 443;
  https.createServer(credentials, app).listen(443);

  httpsRedirect = function (req, res) {
    res.writeHead(301, {
      "Location": config.mediumUrl + req.url
    });
    res.end();
  }

  console.log(`HTTPS proxy started on port ${httpPort}.`);
}

const httpPort = config.httpPort || 80;
http.createServer(httpsRedirect).listen(httpPort);

console.log(`HTTP proxy started on port ${httpPort}.`);
