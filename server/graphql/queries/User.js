const { User: UserType } = require('./../types')
const { Models: { User }} = require('./../../db/models')
const { decodeAuthToken } = require('./../../utils')
const { variableNames: { authTokenKey }} = require('./../../../constants')

// retrieve a user with a token, used on client application init to login
exports.getUserWithToken = {
  type: UserType,
  resolve: async (_, __, { headers }) => {
    // decode token
    const decodedToken = decodeAuthToken({ token: headers[authTokenKey] })
    return await User.findById(decodedToken.uid).lean()
  }
}
