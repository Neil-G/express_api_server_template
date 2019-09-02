const mongoose = require('mongoose')

module.exports =  {
  name: 'User',
  config: {
    // firstName:  String,
    // lastName:   String,
    // userName:   { type: String,   unique: true },
    email:      { type: String,   required: true,   unique: true },
    password:   { type: String,   required: true },
    archived:   { type: Boolean,  default: false },
  }
}
