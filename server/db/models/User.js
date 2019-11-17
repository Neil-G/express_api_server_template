const { GraphQLString } = require('graphql')
const jwt = require('jsonwebtoken')


module.exports =  {
  config: {
    firstName:  String,
    lastName:   String,
    userName:   { type: String,   unique: true },
    emailAddress:      { type: String,   required: true,   unique: true },
    isEmailAddressVerified:   { type: Boolean, default: false },
    password:   { type: String,   required: true },   
    isArchived:   { type: Boolean,  default: false }, // soft delete
  },
  graphql: {
    customFields: {
      token: {
        type: GraphQLString,
        resolve: ({ _id }) => jwt.sign({ uid: _id }, 'secret', { expiresIn: '14 days'})
      }
    }
  }
}
