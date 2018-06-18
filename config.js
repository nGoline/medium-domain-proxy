module.exports = {
  // Change this to your full medium URI
  mediumUrl: 'https://medium.com/ngoline',

  // Change if you like to use another port. Default is 80
  httpPort: 80,

  https: {
    // Uncoment here to use SSL. You can change it if you like to use another port. Default is 443
    //port: 443,
    
    // Uncoment here to use SSL. You can change it to your full private key folder
    //privateKey: 'sslcert/server.key',

    // Uncoment here to use SSL. You can change it to your full certificate folder
    //certificate: 'sslcert/server.cts'
  },

  // Uncoment to serve your own images on a public folder
  publicFolder: 'public'
}