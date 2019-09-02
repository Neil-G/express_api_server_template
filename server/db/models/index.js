let mongoose = require('mongoose')
mongoose.connect('mongodb://user123:password123@ds215988.mlab.com:15988/express_api_server_template') // move to config
mongoose.Promise = require('bluebird')


// helper function for creating mongodb models from configs
function createModel (modelConfig) {
  return mongoose.model(
    modelConfig.name,
    mongoose.Schema(modelConfig.config)
  )
}


module.exports = {
  User: createModel(require('./User')),
}
