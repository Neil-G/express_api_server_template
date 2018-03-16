const { GraphQLString, GraphQLNonNull } = require ('graphql')
const { UserType } = require('./../types')
const { User } = require('./../../db/models')
const { hashSync } = require('bcrypt')
const jwt = require('jsonwebtoken')


/********************************
            UPDATE
  (including delete as archive)
********************************/
exports.updateUser = {
  type: UserType,
  description: 'Create a User',
  args: {
    id: {
      description: 'unique id (required)',
      type: GraphQLNonNull(GraphQLString)
    },
    userName: {
      description: 'first name',
      type: GraphQLString
    },
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
    archived: {
      description: 'email',
      type: GraphQLString
    },
  },
  resolve: async (root, updates) => {

    const uid = updates.id
    delete updates.id

    return await User.findOne({ '_id': uid })
      .then(user => {

        Object.keys(updates).forEach(key => {
          user[key] = updates[key]
        })

        return user.save()
      })
  }
}
