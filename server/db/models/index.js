let mongoose = require('mongoose')
const fs = require('fs')
const { resolve, basename } = require('path')
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
  .filter(filename => filename !== basename(__filename))
  .forEach(filename => {
    const ModelTemplate = require(resolve(__dirname, filename))
    if (!ModelTemplate.config) return
    const modelFilename = filename.slice(0, -3)
    // add fields common to all models
    ModelTemplate.name = modelFilename
    ModelTemplate.config.createdAt = { type: Date, default: Date.now }
    ModelTemplate.config.lastUpdated = { type: Date }
    configuredModels.ModelTemplates[modelFilename] = ModelTemplate
    configuredModels.Models[modelFilename] = createModel(ModelTemplate)
})

module.exports = configuredModels


