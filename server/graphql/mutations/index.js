const { GraphQLObjectType, GraphQLInputObjectType } = require ('graphql')
const { Models, ModelTemplates } = require('./../../db/models')
const types = require('./../types')
const { getTypesFromMongoModel } = require('./../types/utils')

/*
|--------------------------------------------------------------------------
| Map Mongoose Mutations
|--------------------------------------------------------------------------
*/

const genericMutations = {}
Object.keys(ModelTemplates).map(modelName => {
  const Type = types[modelName]
  const Model = Models[modelName]
  const ModelTemplate = ModelTemplates[modelName]

  // findOneAndUpdate
  genericMutations[`findOne${modelName}AndUpdate`] =  {
    description: `finds and updates a${modelName}`,
    type: Type,
    args: {
      query: {
        type: new GraphQLInputObjectType({
          name: 'findOneAndUpdate_query',
          fields: () => getTypesFromMongoModel(ModelTemplate.config)
        })
      },
      updates: {
        type: new GraphQLInputObjectType({
          name: 'findOneAndUpdate_updates',
          fields: () => getTypesFromMongoModel(ModelTemplate.config)
        })
      }
    },
    resolve: async (_, { query, updates }) => {
      return await Model.findOneAndUpdate(
        query, 
        { $set: updates },
        { new: true }
      )
    }
  }
})

module.exports = new GraphQLObjectType({
  name: 'Mutation',
  fields:  { ...genericMutations },
})