// TODO: extract mongo credentials to env variables

module.exports = {
  development: {
    appRootUrl: 'http://localhost:3000',
    mongoUrl: 'mongodb://user123:password123@ds215988.mlab.com:15988/express_api_server_template',
  },
  production: {
    appRootUrl: '/app',
    mongoUrl: 'mongodb://user123:password123@ds215988.mlab.com:15988/express_api_server_template',
  },
  testing: {
    mongoUrl: 'mongodb://user123:password123@ds215988.mlab.com:15988/express_api_server_template',
  }
}
