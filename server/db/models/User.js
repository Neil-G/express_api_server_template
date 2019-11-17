const { GraphQLString } = require('graphql')
const jwt = require('jsonwebtoken')


module.exports =  {
  config: {
    firstName:  String,
    lastName:   String,
    userName:   { type: String,   unique: true },
    emailAddress:      { type: String,   required: true,   unique: true },
    password:   { type: String,   required: true },
    archived:   { type: Boolean,  default: false },
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
