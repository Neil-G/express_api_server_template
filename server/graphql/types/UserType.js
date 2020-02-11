const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLString,
  GraphQLBoolean,
} = require('graphql')
const { getTypesFromMongoModel, idField, getVirtualTypeFields } =require('./utils')
const { variableNames: { authTokenKey }} = require('./../../../constants')
const modelTemplate = require('../../db/models/UserModel')

/*
|--------------------------------------------------------------------------
| Custom Type Fields
|--------------------------------------------------------------------------
*/

const customTypeFields = () => {
  return {
  
  }
}

/*
|--------------------------------------------------------------------------
| Configure and Export
|--------------------------------------------------------------------------
*/

module.exports = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    ...idField,
    ...customTypeFields(),
    ...getTypesFromMongoModel(modelTemplate.config),
    ...getVirtualTypeFields(modelTemplate.virtuals),
  })
})