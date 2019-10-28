const { GraphQLObjectType, GraphQLID, GraphQLString } = require('graphql')
const jwt = require('jsonwebtoken')
const { idField, getTypesFromMongoModel } = require('./utils')
const { name, config: modelConfig } = require('./../../db/models/User')

/*
|--------------------------------------------------------------------------
| Custom Fields
|--------------------------------------------------------------------------
*/

const customFields = {
  token: {
    type: GraphQLString,
    resolve: ({ _id }) => jwt.sign({ uid: _id }, 'secret', { expiresIn: '14 days'})
  }
}

/*
|--------------------------------------------------------------------------
| Custom Fields
|--------------------------------------------------------------------------
*/

module.exports = new GraphQLObjectType({
  name: name.toLowerCase(),
  fields:  () => {
    return { ...idField, ...customFields, ...getTypesFromMongoModel(modelConfig)} 
  }
})
