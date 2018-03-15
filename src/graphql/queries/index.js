const { GraphQLObjectType } = require ('graphql')


module.exports = new GraphQLObjectType({
  name: 'Query',
  fields: function () {
    return Object.assign({},
      require('./User'),
    )
  }
})
