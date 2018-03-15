const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./config')
const authRoutes = require('./src/routes/auth')
const graphqlHTTP = require('express-graphql')
const GraphQLSchema = require('./src/graphql')


// auth routes
app.use('/auth', authRoutes)


// graphql endpoint
app.use('/graphql', graphqlHTTP({
  schema: GraphQLSchema,
  graphiql: true,
  pretty: true
}))


// start up server
app.listen(5678, () => {
  console.log('Example app listening on port 5678!')
})
