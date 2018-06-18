# Medium Domain Proxy

This Node.js Proxy allows your Medium page to have a custom domain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

This instructions are known to work on Ubuntu 16.04.3 LTS, it may or may not work on other Linux distributions/versions.
If you use NGINX, like me, you'll want to set up your domain first (including SSL).

### Installing

Clone this repository to your server.

```bash
git clone https://github.com/ngoline/medium-domain-proxy
```

Go to the downloaded folder

```bash
cd medium-domain-proxy
```

Install npm packages

```bash
npm i
```

Update the config file to change what's needed.

```javascript
// Change this to your full medium URI
mediumUrl: 'https://medium.com/ngoline',
```

Run the proxy

```bash
npm start
```

## Deployment

This instructions are to use PM2 as a Node.js process manager, but you can use any process manager you want.

### Using PM2

If you dont have PM2 installed just run

```bash
npm install pm2 -g
```

Then initialize the proxy process

```bash
pm2 start app.js
```

## Built With

* [Node.js](https://nodejs.org/)
* [Express](https://expressjs.com/)

## Contributing

Please read [CONTRIBUTING.md](https://github.com/ngoline/medium-domain-proxy/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/ngoline/medium-domain-proxy/tags).

## Authors

* **Níckolas Goline** - *Initial work* - [nGoline](https://github.com/ngoline)

See also the list of [contributors](https://github.com/ngoline/medium-domain-proxy/contributors) who participated in this project.

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE.md](LICENSE.md) file for details
