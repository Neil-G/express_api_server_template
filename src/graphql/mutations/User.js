const { GraphQLString } = require ('graphql')
const { UserType } = require('./../types')
const { User } = require('./../../db/models')


// CREATE
exports.createUser = {
  type: UserType,
  description: 'Create a User',
  args: {
    firstName: {
      description: 'first name',
      type: GraphQLString
    },
    lastName: {
      description: 'last name',
      type: GraphQLString
    },
    email: {
      description: 'email',
      type: GraphQLString
    },
    password: {
      description: 'password',
      type: GraphQLString
    },
  },
  resolve: async (root, newUserArgs) => {

    let newUser = await new User(newUserArgs)
        .save()
        .then(res => res)

    return newUser
  }
}
