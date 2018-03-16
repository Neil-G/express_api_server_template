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
    email: {
      name: 'email',
      type: GraphQLString
    },
  },
  resolve: async (root, { id, email }) => {

    if (!id && !email) {
      throw Error('Must provide either id or email as a paramter to retrieve a user.')
    }
    
    // determine query params by user input
    const queryArgs = id ? { '_id': id } : { email }

    return await User.findOne(queryArgs).lean()
  }
}
