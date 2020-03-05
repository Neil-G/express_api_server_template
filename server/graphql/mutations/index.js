const { GraphQLObjectType, GraphQLInputObjectType, GraphQLString } = require ('graphql')
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
  let mutationName

  // findOneAndUpdate
  mutationName = `findOne${modelName}AndUpdate`
  genericMutations[mutationName] =  {
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
  mutationName = `find${modelName}ByIdAndUpdate`
  genericMutations[mutationName] =  {
    description: `finds and updates a ${modelName}`,
    type: Type,
    args: {
      userId: { name: 'user_id', type: GraphQLString },
      updates: {
        type: new GraphQLInputObjectType({
          name: `${mutationName}_updates`,
          fields: () => getTypesFromMongoModel(ModelTemplate.config)
        })
      }
    },
    resolve: async (_, { userId, updates }) => {
      return await Model.findByIdAndUpdate(
        userId, 
        { $set: updates },
        { new: true }
      )
    }
  }

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