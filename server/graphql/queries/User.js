const jwt = require('jsonwebtoken')
const { User: UserType } = require('./../types')
const { Models: { User }} = require('./../../db/models')

// retrieve a user with a token, used on client application init to login
exports.getUserWithToken = {
  type: UserType,
  args: {}, // only header token is used
  resolve: async (_, __, req) => {
    console.log('in gql query')
    // decode token
    const decodedToken = jwt.verify(req.headers.token, 'secret')
    return await User.findById(decodedToken.uid).lean()
  }
}
