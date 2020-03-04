require('dotenv').config()
const express = require('express')
const app = express()
var exphbs  = require('express-handlebars')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./config')[process.env.NODE_ENV]
var cors = require('cors')
const { resolve } = require('path')
const requestLogger = require('./server/utils/requestLogger')
const { configuredControllersRouter, controllerConfigs } = require('./server/controllers')
const graphqlHTTP = require('express-graphql')
const GraphQLSchema = require('./server/graphql')
const { errors } = require('celebrate')
const { isLoggedIn } = require('./server/middleware/auth')
const { 
  variableNames: { 
    authTokenKey 
  }, 
  routes: {
    graphQLRoute,
    graphiQLRoute,
    registerAndLoginRoute,
    loginWithTokenRoute,
    loginWithEmailAndPassword,
    allAppRoutes
}} = require('./constants')


/*
|--------------------------------------------------------------------------
| App Configuration
|--------------------------------------------------------------------------
*/

const PORT = 5678

const appConfiguration = [
  express.static('public'),
  express.static('./client/build'),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: false }),
  cookieParser(),
  requestLogger,
  cors(),
]

const appSettings = {
  'view engine': 'handlebars',
  'json spaces': 2,
}

appConfiguration.forEach(setting => app.use(setting))
Object.entries(appSettings).forEach(([key, value]) => app.set(key, value))
app.engine('handlebars', exphbs());

/*
|--------------------------------------------------------------------------
| Static Page Routes
|--------------------------------------------------------------------------
*/

const staticPageConfigs = [
  {
    route: '/',
    view: 'home',
    args: {
      authTokenKey,
      registerAndLoginRoute,
      loginWithTokenRoute,
      loginWithEmailAndPassword,
      appUrl: config.appRootUrl 
    }
  },
  {
    route: '/api-docs',
    view: 'api_docs',
    args: {
      controllerConfigs
    }
  }
]

staticPageConfigs.forEach(({ route, view, args }) => {
  app.get(route, (_, res) => {
    res.render(view, args)
  })
})

/*
|--------------------------------------------------------------------------
| React Application
|--------------------------------------------------------------------------
*/

app.get(allAppRoutes, (_, res) => {
  res.sendFile(resolve(`./client/build/_index.html`))
})

/*
|--------------------------------------------------------------------------
| API Endpoints
|--------------------------------------------------------------------------
*/

app.use('/', configuredControllersRouter)

/*
|--------------------------------------------------------------------------
| GraphQL
|--------------------------------------------------------------------------
*/

app.use(graphQLRoute, isLoggedIn, graphqlHTTP({
  schema: GraphQLSchema,
  pretty: true
}))

if (process.env.NODE_ENV !== 'production') {
  app.use(graphiQLRoute, graphqlHTTP({
    schema: GraphQLSchema,
    graphiql: true,
    pretty: true
  }))
}

/*
|--------------------------------------------------------------------------
| 404 & errors
|--------------------------------------------------------------------------
*/

// 404 page
app.use('*', (_, res) => res.send('404'))

// handle errors
app.use(errors());

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
})
