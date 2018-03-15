const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./config')
const authRoutes = require('./src/routes/auth')
const graphqlHTTP = require('express-graphql')
const GraphQLSchema = require('./src/graphql')


// static folder
app.use(express.static('public'))


// format request info
app.set('json spaces', 2)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


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
