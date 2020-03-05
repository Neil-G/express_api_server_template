const uuidv1 = require('uuid/v1');
const { createAuthToken } = require('../../utils')
const { variableNames: { authTokenKey }} = require('../../../constants')

module.exports =  {
  modelName: 'User',
  typeName: 'UserType',
  config: {
    firstName:  String,
    lastName:   String,
    userName:   { type: String,   unique: true, default: uuidv1() },
    emailAddress:      { type: String,   required: true,   unique: true },
    isEmailAddressVerified:   { type: Boolean, default: false },
    password:   String,   
    isArchived:   { type: Boolean,  default: false }, // soft delete
    facebookUserId: String,
    facebookAccessToken: String,
    googleUserId: String,

  },
  virtuals: {
    [authTokenKey]: {
      type: String,
      resolve: function() {
        return createAuthToken({ user: this })
      }
    },
    fullName: {
      type: String,
      resolve: function() {
        return this.firstName + ' ' + this.lastName
      }
    },
    isFacebookAccountConnected: {
      type: Boolean,
      resolve: function() {
        return !!this.facebookUserId
      }
    },
    isGoogleAccountConnected: {
      type: Boolean,
      resolve: function() {
        return !!this.googleUserId
      }
    },
  },
}
