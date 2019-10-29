let mongoose = require('mongoose')
const fs = require('fs')
const { resolve } = require('path')
const config = require('./../../../config')[process.env.NODE_ENV]

mongoose.connect(config.mongoUrl) 
mongoose.Promise = require('bluebird')


// helper function for creating mongodb models from configs
function createModel (ModelTemplate) {
  
  return mongoose.model(
    ModelTemplate.name,
    mongoose.Schema(ModelTemplate.config)
  )
}

// configure models from templates
// templates are exported also
const configuredModels = { Models: {}, ModelTemplates: {}}
fs.readdirSync(__dirname)
  .filter(fileName => fileName !== 'index.js')
  .forEach(fileName => {
    const modelFileName = fileName.slice(0, -3)
    const ModelTemplate = require(resolve(__dirname, fileName))
    // add fields common to all models
    ModelTemplate.config.createdAt = { type: Date, default: Date.now }
    ModelTemplate.config.lastUpdated = { type: Date }
    configuredModels.ModelTemplates[modelFileName] = ModelTemplate
    configuredModels.Models[modelFileName] = createModel(ModelTemplate)
})

module.exports = configuredModels


