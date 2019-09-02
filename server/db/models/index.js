let mongoose = require('mongoose')
mongoose.connect('mongodb://user:pw123@ds215089.mlab.com:15089/express_api_server_template')
mongoose.Promise = require('bluebird')


// helper function for creating models from configs
function createModel (modelConfig) {
  return mongoose.model(
    modelConfig.name,
    mongoose.Schema(modelConfig.config)
  )
}


module.exports = {
  User: createModel(require('./User')),
}
