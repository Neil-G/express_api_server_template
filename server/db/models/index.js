let mongoose = require('mongoose')
const config = require('./../../../config')[process.env.NODE_ENV]

mongoose.connect(config.mongoUrl) 
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
