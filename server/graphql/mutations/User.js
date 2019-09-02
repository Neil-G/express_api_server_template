const { GraphQLString, GraphQLNonNull } = require ('graphql')
const { UserType } = require('./../types')
const { User } = require('./../../db/models')
const { ObjectId } = require('mongoose').Types

/********************************
            UPDATE
  (including delete as archive)
********************************/
exports.updateUser = {
  type: UserType,
  description: 'update a User',
  args: {
    userId: {
      description: 'unique id (required)',
      type: GraphQLNonNull(GraphQLString)
    },
    userName: {
      description: 'username',
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
    emailAddress: {
      description: 'email address',
      type: GraphQLString
    },
    archived: {
      description: 'email',
      type: GraphQLString
    },
  },
  resolve: async (root, updates) => {

    const uid = updates.userId
    delete updates.id

    return await User.findOneAndUpdate(
      { _id: ObjectId(uid) },
      { $set: updates },
      { new: true }
    )
  }
}
