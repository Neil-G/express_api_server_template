const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./config')


app.listen(5678, () => {
  console.log('Example app listening on port 5678!')
})
