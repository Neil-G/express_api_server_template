const mongoose = require('mongoose')
const { Schema } = mongoose


module.exports =  {
  name: 'User',
  config: {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    encryptedPassword: String,
  }
}
