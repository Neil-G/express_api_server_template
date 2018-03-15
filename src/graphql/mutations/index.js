const { GraphQLObjectType } = require ('graphql')


module.exports = new GraphQLObjectType({
  name: 'Mutation',
  fields: Object.assign({},
    require('./User'),
  )
})
