const { GraphQLObjectType, GraphQLID, GraphQLString } = require('graphql')


module.exports = new GraphQLObjectType({
  name:'user',
  fields:  () => {
    return {
      id: {
        type: GraphQLID
      },
      firstName: {
        type: GraphQLString
      },
      lastName: {
        type: GraphQLString
      },
      email: {
        type: GraphQLString
      },
    }
  }
})
