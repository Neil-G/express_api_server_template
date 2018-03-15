const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { User } = require('./../db/models')
const { compareSync } = require('bcrypt')



router.post('/login', async (req, res) => {

  // get user input
  const { email, password } = req.body

  // get user from database
  const user = await User.findOne({ email })

  // check user input against db
  if (user && compareSync(password, user.password)) {

    // json web token to hold session on client
    const token = jwt.sign({ uid: user.id }, 'secret')

    // return token to client
    return res.send({ token })

  } else {

    // return error, email/pw combination not found
    return res.send(404)

  }

})


module.exports = router
