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
        resolve: ({ _id }) => _id
    }
}


/*
|--------------------------------------------------------------------------
| Generates Basic Type Fields
|--------------------------------------------------------------------------
*/

const generateTypeFields = config => {
    const typeFields = {}
    const { id = [], string = [], boolean = [], number = [], date = [] } = config
    id.forEach(key => {
      typeFields[key] = { type: GraphQLID }
    })
    string.forEach(key => {
      typeFields[key] = { type: GraphQLString }
    })
    boolean.forEach(key => {
      typeFields[key] = { type: GraphQLBoolean }
    })
    number.forEach(key => {
      typeFields[key] = { type: GraphQLFloat }
    })
    date.forEach(key => {
      typeFields[key] = { type: GraphQLString }
    })
    return typeFields
}

/*
|--------------------------------------------------------------------------
| Create Type Fields From Mongo Model
|--------------------------------------------------------------------------
*/

const keysBlacklist = ['password']
exports.getTypesFromMongoModel = modelConfig => {
    const fieldsFromModelConfig = { string: [], boolean: [], number: [], date: []}
    Object.entries(modelConfig).forEach(([key, value]) => {
        if (value.type === String && ![keysBlacklist].includes(key)) {
          fieldsFromModelConfig.string.push(key)
        }
        if (value.type === Boolean) {
            fieldsFromModelConfig.boolean.push(key)
        }
        if (value.type === Number) {
            fieldsFromModelConfig.number.push(key)
        }
        if (value.type === Date) {
            fieldsFromModelConfig.string.push(key)
        }
      })
    return generateTypeFields(fieldsFromModelConfig)
}