const { GraphQLObjectType, GraphQLID, GraphQLString } = require('graphql')
const jwt = require('jsonwebtoken')

module.exports = new GraphQLObjectType({
  name:'user',
  fields:  () => {
    return {
      id: {
        type: GraphQLID,
        resolve: ({ _id }) => _id
      },
      firstName: {
        type: GraphQLString
      },
      lastName: {
        type: GraphQLString
      },
      emailAddress: {
        type: GraphQLString
      },
      token: {
        type: GraphQLString,
        resolve: ({ _id }) => jwt.sign({ uid: _id }, 'secret', { expiresIn: '14 days'})
      }
    }
  }
})
