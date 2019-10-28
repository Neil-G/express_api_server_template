const jwt = require('jsonwebtoken')
const { GraphQLID, GraphQLString } = require ('graphql')
const { UserType } = require('./../types')
const { User } = require('./../../db/models')


exports.getUser = {
  type: UserType,
  args: {
    id: {
      name: 'id',
      type: GraphQLID
    },
    emailAddress: {
      name: 'emailAddress',
      type: GraphQLString
    },
  },
  resolve: async (_, { id, emailAddress }) => {

    if (!id && !emailAddress) {
      throw Error('Must provide either id or emailAddress as a paramter to retrieve a user.')
    }
    
    // determine query params by user input
    const queryArgs = id ? { '_id': id } : { emailAddress }

    return await User.findOne(queryArgs).lean()
  }
}


exports.getUserWithToken = {
  type: UserType,
  args: {}, // only header token is used
  resolve: async (_, __, req) => {

    // decode token
    const decodedToken = jwt.verify(req.headers.token, 'secret')

    return await User.findById(decodedToken.uid).lean()
  }
}
