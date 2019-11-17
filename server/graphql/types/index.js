const { GraphQLObjectType } = require('graphql')
const { get } = require('lodash')
const { idField, getTypesFromMongoModel } = require('./utils')
const models = require('./../../db/models')

const generatedTypes = {}
Object.entries(models.ModelTemplates).map(([modelFilename, modelTemplate]) => {
  generatedTypes[modelFilename] = new GraphQLObjectType({
    name: modelFilename.toLowerCase(),
    fields:  () => ({ 
        ...idField, 
        ...get(modelTemplate, 'graphql.customFields', {}), 
        ...getTypesFromMongoModel(modelTemplate.config)
    }) 
  })
})

module.exports = generatedTypes
