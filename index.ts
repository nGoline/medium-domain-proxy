import fs from 'fs';
import express, { Request, Response } from 'express';
import serveStatic from 'serve-static';
import https from 'https';
import http from 'http';
import request from 'request';

const app = express();
const port = process.env.HTTP_PORT || 80;
const httpsPort = process.env.HTTPS_PORT || 443;
const mediumUrl = process.env.MEDIUM_URL || 'https://medium.com/the-blockchains-state';
const searchUserName = process.env.SEARCH_USER_NAME || 'ngoline';
const publicFolder = process.env.PUBLIC_FOLDER;
const publicFileTypes = (process.env.PUBLIC_FILE_TYPES || '.jpg,.png,.txt,.html').split(',');

let serve: any;
if (publicFolder && publicFileTypes.length) {
  serve = serveStatic(publicFolder);
}

const redirect = (location: string, res: Response) => {
  res.writeHead(301, { "Location": location });
  res.end();
};

const redirectMedium = (req: Request, res: Response) => {
  const location = mediumUrl + req.url;
  if (searchUserName) {
    request(location, (error, response, body) => {
      if (!error && response.statusCode == 200 && !body.includes(404)) {
        console.log(response)
        console.log(`Redirecting to ${location}`);
        redirect(location, res);
      } else {
        console.log(`Redirecting to search for ${searchUserName} in ${req.url}`);
        redirect(`https://medium.com/search?q=${searchUserName}+${req.url}`, res);
      }
    });
  } else {
    console.log(`No username provided. Redirecting to ${location}`);
    redirect(location, res);
  }
};

app.get('/*', (req, res) => {
  if (publicFolder && publicFileTypes.length) {
    const hasExtension = publicFileTypes.some(element => req.url.endsWith(element));
    if (hasExtension) {
      return serve(req, res, () => {
        redirectMedium(req, res);
      });
    }
  }
  redirectMedium(req, res);
});

if (process.env.HTTPS_PRIVATE_KEY && process.env.HTTPS_CERTIFICATE) {
  const privateKey = fs.readFileSync(process.env.HTTPS_PRIVATE_KEY, 'utf8');
  const certificate = fs.readFileSync(process.env.HTTPS_CERTIFICATE, 'utf8');
  const credentials = { key: privateKey, cert: certificate };

  https.createServer(credentials, app).listen(httpsPort, () => {
    console.log(`HTTPS proxy started on port ${httpsPort}.`);
  });
}

http.createServer(app).listen(port, () => {
  console.log(`HTTP proxy started on port ${port}.`);
});