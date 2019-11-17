const { GraphQLString } = require('graphql')
const uuidv1 = require('uuid/v1');
const { createAuthToken } = require('./../../utils')
const { variableNames: { authTokenKey }} = require('./../../../constants')

module.exports =  {
  config: {
    firstName:  String,
    lastName:   String,
    userName:   { type: String,   unique: true, default: uuidv1() },
    emailAddress:      { type: String,   required: true,   unique: true },
    isEmailAddressVerified:   { type: Boolean, default: false },
    password:   { type: String,   required: true },   
    isArchived:   { type: Boolean,  default: false }, // soft delete
  },
  graphql: {
    customFields: {
      [authTokenKey]: {
        type: GraphQLString,
        resolve: user => createAuthToken({ user })
      }
    }
  }
}
