const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLString,
  GraphQLBoolean,
} = require('graphql')
const { getTypesFromMongoModel, idField } =require('./utils')
const modelTemplate = require('./../../db/models/User')
const { createAuthToken,  } = require('./../../utils')
const { variableNames: { authTokenKey }} = require('./../../../constants')

const customTypeFields = () => {
  return {
    ...idField,
    [authTokenKey]: {
      type: GraphQLString,
      resolve: user => user[authTokenKey]
    }
  }
}

module.exports = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    ...idField,
    ...customTypeFields(),
    ...getTypesFromMongoModel(modelTemplate.config)
  })
})