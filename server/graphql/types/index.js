const { GraphQLObjectType } = require('graphql')
const { get } = require('lodash')
const { idField, getTypesFromMongoModel } = require('./utils')
const models = require('./../../db/models')

const generatedTypes = {}
Object.entries(models.ModelTemplates).map(([modelFileName, modelTemplate]) => {
  generatedTypes[modelFileName] = new GraphQLObjectType({
    name: modelFileName.toLowerCase(),
    fields:  () => ({ 
        ...idField, 
        ...get(modelTemplate, 'graphql.customFields', {}), 
        ...getTypesFromMongoModel(modelTemplate.config)
    }) 
  })
})

module.exports = generatedTypes
