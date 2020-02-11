const { GraphQLObjectType, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLInputObjectType } = require ('graphql')
const fs = require('fs')
const { resolve } = require('path')
const { Models, ModelTemplates } = require('./../../db/models')
const types = require('./../types')
const { getTypesFromMongoModel } = require('./../types/utils')

/*
|--------------------------------------------------------------------------
| Generate Generic Queries
|--------------------------------------------------------------------------
*/

const generatedQueries = {}
Object.keys(ModelTemplates).map(modelName => {
  const ModelTemplate = ModelTemplates[modelName]
  const Type = types[ModelTemplate.typeName]
  const Model = Models[modelName]

  // findById
  generatedQueries[`find${modelName}ById`] = {
    description: `find a ${modelName} by id`,
    type: Type,
    args: {
      id: {
        name: 'id',
        type: GraphQLNonNull(GraphQLID),
      },
    },
    resolve: async (_, { id }) => {
      return await Model.findById(id)
    }
  }

  // findOne


  // find (many)
  generatedQueries[`find${modelName}s`] = {
    description: `find ${modelName}s`,
    type: GraphQLList(Type),
    args: {
      query: {
        type: new GraphQLInputObjectType({
          name: 'findUsers_query',
          fields: () => getTypesFromMongoModel(ModelTemplate.config)
        })
      }
    },
    resolve: async (_, { query }) => {
      return await Model.find(query)
    }
  }
})

/*
|--------------------------------------------------------------------------
| Get Queries from directory files
|--------------------------------------------------------------------------
*/

let combinedQueries = {}
fs.readdirSync(__dirname)
  .filter(fileName => fileName !== 'index.js')
  .forEach(fileName => {
    const customQueries = require(resolve(__dirname, fileName))
    combinedQueries = { ...combinedQueries, ...customQueries }
})

/*
|--------------------------------------------------------------------------
| Combine Queries and Export
|--------------------------------------------------------------------------
*/

module.exports = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({ 
    ...generatedQueries, 
    ...combinedQueries 
  }),
})
