const { GraphQLObjectType, GraphQLID, GraphQLString } = require('graphql')


module.exports = new GraphQLObjectType({
  name:'user',
  fields:  () => {
    return {
      id: {
        type: GraphQLID,
        resolve: source => source._id
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
    }
  }
})
