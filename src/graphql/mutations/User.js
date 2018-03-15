const { GraphQLString } = require ('graphql')
const { UserType } = require('./../types')
const { User } = require('./../../db/models')
const { hashSync } = require('bcrypt')

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

    // encrypt password
    newUserArgs.password = hashSync(newUserArgs.password, 10)

    let newUser = await new User(newUserArgs)
        .save()
        .then(res => res)

    return newUser
  }
}
