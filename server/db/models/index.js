let mongoose = require('mongoose')
const fs = require('fs')
const { resolve, basename } = require('path')
const config = require('./../../../config')[process.env.NODE_ENV]

mongoose.connect(config.mongoUrl) 
mongoose.Promise = require('bluebird')

/*
|--------------------------------------------------------------------------
| Create Model Helper Method
|--------------------------------------------------------------------------
*/

const createModel = (ModelTemplate) => {
  // Create schema from model template config
  const schema = new mongoose.Schema(ModelTemplate.config, {
    minimize: false,
  })
  // Add virtual fields
  if (ModelTemplate.virtuals) {
    Object.keys(ModelTemplate.virtuals).forEach(fieldName => {
      const virtualMethod = ModelTemplate.virtuals[fieldName].resolve
      schema.virtual(fieldName).get(virtualMethod)
    })
  }
  return mongoose.model(ModelTemplate.modelName, schema)
}

/*
|--------------------------------------------------------------------------
| Configure Models and Export Templates and Configured Models
|--------------------------------------------------------------------------
*/

const configuredModels = { Models: {}, ModelTemplates: {}}
fs.readdirSync(__dirname)
  .filter(filename => filename !== basename(__filename))
  .forEach(filename => {
    const ModelTemplate = require(resolve(__dirname, filename))
    if (!ModelTemplate.config) return
    // Add fields common to all models
    ModelTemplate.config.createdAt = { type: Date, default: Date.now }
    ModelTemplate.config.lastUpdated = { type: Date }
    // Make template and configured model available for export
    configuredModels.ModelTemplates[ModelTemplate.modelName] = ModelTemplate
    configuredModels.Models[ModelTemplate.modelName] = createModel(ModelTemplate)
})

module.exports = configuredModels


