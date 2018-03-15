const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./config')
const authRoutes = require('./src/routes/auth')


// auth routes
app.use('/auth', authRoutes)



// start up server
app.listen(5678, () => {
  console.log('Example app listening on port 5678!')
})
