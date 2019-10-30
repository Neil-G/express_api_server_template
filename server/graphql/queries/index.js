const { GraphQLObjectType, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLInputObjectType } = require ('graphql')
const fs = require('fs')
const { resolve } = require('path')
const { Models, ModelTemplates } = require('./../../db/models')
const types = require('./../types')
const { getTypesFromMongoModel, generateTypeFields } = require('./../types/utils')
const { controllerConfigs } = require('./../../controllers')

/*
|--------------------------------------------------------------------------
| Map Mongoose Queries
|--------------------------------------------------------------------------
*/

// generate queries based on mongoose queries
const generatedQueries = {}
Object.keys(ModelTemplates).map(modelName => {
  const Type = types[modelName]
  const Model = Models[modelName]
  const ModelTemplate = ModelTemplates[modelName]

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

let combinedQueries = {}
fs.readdirSync(__dirname)
  .filter(fileName => fileName !== 'index.js')
  .forEach(fileName => {
    const customQueries = require(resolve(__dirname, fileName))
    combinedQueries = { ...combinedQueries, ...customQueries }
})

const getAllControllerConfigs = {
  type: GraphQLList(new GraphQLObjectType({
    name: 'controller_config',
    fields: () => generateTypeFields({
      string: ['route', 'method', 'fileName']
    })
  })),
  resolve: () => controllerConfigs,
}


module.exports = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({ 
    getAllControllerConfigs,
    ...generatedQueries, 
    ...combinedQueries 
  }),
})
