const express = require('express')
const app = express()
var exphbs  = require('express-handlebars');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./config')[process.env.NODE_ENV]
var cors = require('cors')
const { resolve } = require('path')
const chalk = require('chalk')
const { configuredControllersRouter, controllerConfigs } = require('./server/controllers')
const graphqlHTTP = require('express-graphql')
const GraphQLSchema = require('./server/graphql')
const { errors } = require('celebrate');
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

const PORT = 5678

// static folder
app.use(express.static('public'))
app.use(express.static('./client/build'))

// template engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// format request info
app.set('json spaces', 2)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// cors
app.use(cors())

// logging
app.use((req, _, next) => {
  if (req.path.includes('api')) {
    console.log(chalk.magenta(`${req.method} ${req.path}`))
    return next()
  }
  if (req.path.includes('graphql')) {
    console.log(chalk.green(`${req.method} ${req.path}`))
    return next()
  }
  if (req.path.includes('.css') || req.path.includes('.ico')) {
    console.log(chalk.blueBright(`${req.method} ${req.path}`))
    return next()
  }
  console.log(chalk.yellow(`${req.method} ${req.path}`))
  next()
})

// public pages
app.get('/', (_, res) => {
  res.render('home', {
    authTokenKey,
    registerAndLoginRoute,
    loginWithTokenRoute,
    loginWithEmailAndPassword,
    appUrl: config.appRootUrl 
  });
});

app.get('/api-docs', (_, res) => {
  res.render('api_docs', {
    controllerConfigs,
  });
});

// React application
app.get(allAppRoutes, (_, res) => {
  res.sendFile(resolve(`./client/build/_index.html`))
})

// configured controllers
app.use('/', configuredControllersRouter)

// graphql endpoint
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

// 404 page
app.use('*', (_, res) => res.send('404'))

// handle errors
app.use(errors());

// start up server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
})
