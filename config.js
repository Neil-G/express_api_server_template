module.exports = {
  development: {
    port: 1000,
    appRootUrl: 'http://localhost:3000',
    mongoUrl: 'mongodb://user123:password123@ds215988.mlab.com:15988/express_api_server_template',
  },
  production: {
    appRootUrl: '/app'
  },
  testing: {
    mongoUrl: 'mongodb://user123:password123@ds215988.mlab.com:15988/express_api_server_template',
  }
}
