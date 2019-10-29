const jwt = require('jsonwebtoken')
const { User: UserType } = require('./../types')
const { Models: { User }} = require('./../../db/models')

// retrieve a user with a token, used on client application init to login
exports.getUserWithToken = {
  type: UserType,
  resolve: async (_, __, { headers: { token }}) => {
    // decode token
    const decodedToken = jwt.verify(token, 'secret')
    return await User.findById(decodedToken.uid).lean()
  }
}
