const { GraphQLID } = require ('graphql')
const { UserType } = require('./../types')
const { User } = require('./../../db/models')


exports.getUserById = {
  type: UserType,
  args: {
    id: {
      name: 'id',
      type: GraphQLID
    }
  },
  resolve: async (root, { id }) => {

    const user = await User.findOne({ _id: id })

    return user
  }
}
