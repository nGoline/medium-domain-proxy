# Medium Domain Proxy

This Node.js Proxy allows your Medium page to have a custom domain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- Have your domain setup to point to your server
- [Let's Encrypt](https://letsencrypt.org/) - If you want to use HTTPS
- If you **want** to run the service without Docker, you will need [Node.js](https://nodejs.org/)
- If you **want** to use a reverse-proxy, configure your [Nginx](https://www.nginx.com/) or [Apache](https://httpd.apache.org/) to proxy requests to the port you will run this service on

## Running the proxy

### Using Docker

You can either use the available image from [dockerhub](https://hub.docker.com/r/ngoline/medium-domain-proxy) or build your own image by running `docker build -t your-tag .`.

```bash
# Without HTTPS
docker run -d -p 3000:80 \
-e MEDIUM_URL=https://medium.com/ngoline \
-e SEARCH_USERNAME=ngoline \
-e PUBLIC_FOLDER=/var/www/your.domain \
-v /path/to/your/public/folder:/var/www/your.domain \
ngoline/medium-domain-proxy
#
# OR with HTTPS
docker run -d -p 3000:80 \
-p 3001:443 \
-e MEDIUM_URL=https://medium.com/ngoline \
-e SEARCH_USERNAME=ngoline \
-e PUBLIC_FOLDER=/var/www/your.domain \
-e HTTPS_PRIVATE_KEY=/etc/letsencrypt/live/your.domain/privkey.pem \
-e HTTPS_CERTIFICATE=/etc/letsencrypt/live/your.domain/fullchain.pem \
-v /path/to/your/public/folder:/var/www/your.domain \
-v /etc/letsencrypt/live/your.domain:/etc/letsencrypt/live/your.domain \
ngoline/medium-domain-proxy
```

### Using Node.js

Clone this repository to your server.

```bash
git clone https://github.com/ngoline/medium-domain-proxy && cd medium-domain-proxy
```

Install npm packages and build the project

```bash
npm i && npm run build
```

Run the proxy

```bash
# Set your variables in-line
MEDIUM_URL=https://medium.com/ngoline SEARCH_USERNAME=ngoline PUBLIC_FOLDER=/var/www/your.domain npm start

# Or set them as environment variables
export MEDIUM_URL=https://medium.com/ngoline
export SEARCH_USERNAME=ngoline
export PUBLIC_FOLDER=/var/www/your.domain
npm start
```

### Environment Variables

- `HTTP_PORT` - The port the proxy will listen on. eg. 80
- `HTTPS_PORT` - The port the proxy will listen on for HTTPS requests. eg. 443
- `MEDIUM_URL` - The URL of your Medium page. eg. https://medium.com/ngoline
- `SEARCH_USERNAME` - Your Medium username. eg. ngoline
- `PUBLIC_FOLDER` - The folder where your webserver will serve your files. eg. /var/www/your.domain
- `PUBLIC_FILE_TYPES` - The file types that will be served from the public folder (csv). eg. html,css,js,png,jpg,jpeg,gif,svg,ico,woff,woff2,ttf,eot,otf,mp4,webm,ogg,mp3,wav,flac,aac
- `HTTPS_PRIVATE_KEY` - The path to your private key file. eg. /etc/letsencrypt/live/your.domain/privkey.pem
- `HTTPS_CERTIFICATE` - The path to your certificate file. eg. /etc/letsencrypt/live/your.domain/fullchain.pem

## Built With

* [Node.js](https://nodejs.org/)
* [Express](https://expressjs.com/)
* [TypeScript](https://www.typescriptlang.org/)
* [Docker](https://www.docker.com/)

## License

This project is licensed under the Apache 2.0 License - see [LICENSE.md](LICENSE.md) for details