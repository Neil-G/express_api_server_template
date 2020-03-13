// TODO: extract mongo credentials to env variables

module.exports = {
  development: {
    baseUrl: 'http://localhost:5678',
    appRootUrl: 'http://localhost:3000',
    mongoUrl: 'mongodb://user123:password123@ds215988.mlab.com:15988/express_api_server_template',
  },
  production: {
    baseUrl: 'http://178.128.146.32',
    appRootUrl: '/app',
    mongoUrl: 'mongodb://user123:password123@ds215988.mlab.com:15988/express_api_server_template',
  },
  testing: {
    mongoUrl: 'mongodb://user123:password123@ds215988.mlab.com:15988/express_api_server_template',
  }
}
