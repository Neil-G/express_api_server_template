const {
    GraphQLID,
    GraphQLString,
    GraphQLBoolean,
    GraphQLFloat,
} = require('graphql')

/*
|--------------------------------------------------------------------------
| Converts _id to id
|--------------------------------------------------------------------------
*/

exports.idField = { 
  id: {
    type: GraphQLID,
    resolve: ({ _id }) => String(_id)
  }
}

/*
|--------------------------------------------------------------------------
| Create Type Fields From Mongo Model
|--------------------------------------------------------------------------
*/

const keysBlacklist = ['password']
// TODO: account for foreign keys, objects, arrays, and arrays of objects
exports.getTypesFromMongoModel = modelConfig => {
  const typeFields = {}
  Object.entries(modelConfig).forEach(([key, value]) => {
    if (keysBlacklist.includes(key)) return
    if ((value.type === String || value === String)) {
      typeFields[key] = { type: GraphQLString }
    }
    if (value.type === Boolean || value === Boolean) {
      typeFields[key] = { type: GraphQLBoolean }
    }
    if (value.type === Number || value === Number) {
      typeFields[key] = { type: GraphQLFloat }
    }
    if (value.type === Date || value === Date) {
      typeFields[key] = { type: GraphQLString }
    }
  })
  return typeFields
}

/*
|--------------------------------------------------------------------------
| Create Type Fields From Virtuals
|--------------------------------------------------------------------------
*/

exports.getVirtualTypeFields = modelVirtuals => {
  const typeFields = {}
  Object.entries(modelVirtuals).forEach(([key, { type, _}]) => {
    if (!type) return
    typeFields[key] = {}
    typeFields[key].resolve = modelInstance => modelInstance[key]
    if (type === String) typeFields[key].type = GraphQLString
    if (type === Date) typeFields[key].type = GraphQLString
    if (type === Boolean) typeFields[key].type = GraphQLBoolean
    if (type === Number) typeFields[key].type = GraphQLFloat
  })
  return typeFields
}