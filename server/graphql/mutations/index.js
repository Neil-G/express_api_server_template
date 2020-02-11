const { GraphQLObjectType, GraphQLInputObjectType } = require ('graphql')
const { Models, ModelTemplates } = require('./../../db/models')
const types = require('./../types')
const { getTypesFromMongoModel } = require('./../types/utils')

/*
|--------------------------------------------------------------------------
| Generate Generic Mutations
|--------------------------------------------------------------------------
*/

const genericMutations = {}
Object.keys(ModelTemplates).map(modelName => {
  const ModelTemplate = ModelTemplates[modelName]
  const Type = types[ModelTemplate.typeName]
  const Model = Models[modelName]

  // findOneAndUpdate
  genericMutations[`findOne${modelName}AndUpdate`] =  {
    description: `finds and updates a ${modelName}`,
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

  // findByIdAndUpdate

  // updateMany

  // findOneAndDelete

  // findByIdAndDelete

  // deleteMany

})

/*
|--------------------------------------------------------------------------
| Combine and Export
|--------------------------------------------------------------------------
*/

module.exports = new GraphQLObjectType({
  name: 'Mutation',
  fields:  { ...genericMutations },
})