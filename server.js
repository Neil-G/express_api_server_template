const express = require('express')
const app = express()
var exphbs  = require('express-handlebars');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./config')
const authRoutes = require('./src/routes/auth')
const graphqlHTTP = require('express-graphql')
const GraphQLSchema = require('./src/graphql')


// static folder
app.use(express.static('public'))

// template engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// format request info
app.set('json spaces', 2)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// public pages
app.get('/', function (req, res) {
  res.render('home');
});

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
