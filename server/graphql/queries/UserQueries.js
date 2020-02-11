const { UserType } = require('../types')
const { Models: { User }} = require('../../db/models')
const { decodeAuthToken } = require('../../utils')
const { variableNames: { authTokenKey }} = require('../../../constants')

/*
|--------------------------------------------------------------------------
| Retrieve a user with a token, Used on client application init to login
|--------------------------------------------------------------------------
*/

exports.getUserWithToken = {
  type: UserType,
  resolve: async (_, __, { headers }) => {
    const decodedToken = decodeAuthToken({ token: headers[authTokenKey] })
    return await User.findById(decodedToken.uid)
  }
}
