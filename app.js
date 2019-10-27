const express = require('express')
const app = express()
var exphbs  = require('express-handlebars');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./config')[process.env.NODE_ENV]
var cors = require('cors')
const { resolve } = require('path')
const chalk = require('chalk')
const authRoutes = require('./server/routes/auth')
const graphqlHTTP = require('express-graphql')
const GraphQLSchema = require('./server/graphql')
const { isLoggedIn } = require('./server/middleware/auth')

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
  console.log(chalk.yellow(`${req.method} ${req.path}`))
  next()
})

// public pages
app.get('/', function (req, res) {
  res.render('home', {
    appUrl: config.appRootUrl // move to config
  });
});

// React application
app.get('/app', (req, res) => {
  res.sendFile(resolve(`./client/build/_index.html`))
})

// auth routes
app.use('/api/auth', authRoutes)

// graphql endpoint
app.use('/graphql', isLoggedIn, graphqlHTTP({
  schema: GraphQLSchema,
  graphiql: true,
  pretty: true
}))

if (process.env.NODE_ENV !== 'production') {
  app.use('/graphiql', graphqlHTTP({
    schema: GraphQLSchema,
    graphiql: true,
    pretty: true
  }))
}

// start up server
app.listen(5678, () => {
  console.log('Example app listening on port 5678!')
})
