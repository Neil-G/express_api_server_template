const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { User } = require('./../db/models')
const { hashSync, compareSync } = require('bcrypt')


/********************************
    REGISTER USER AND LOGIN
      (Create and Read)
********************************/
router.post('/register-and-login', async (req, res) => {
  try {
    let newUserArgs = req.body
  
    // encrypt password
    newUserArgs.password = hashSync(newUserArgs.password, 10)
  
    // create user
    let user = await User.create(newUserArgs)
  
    // remove data that shouldn't be sent to the client
    user['__v'] = undefined
    user['password'] = undefined
    user['archived'] = undefined
  
    // give client a new refreshed token
    const token = jwt.sign({ uid: user.id }, 'secret', { expiresIn: '14 days'})
  
    // return response
    return res.send({ token })
  } catch (e) {
    return res.send(e)
  }
})


/********************************
      LOGIN USER AND LOGIN
            (Read)
********************************/
router.post('/login', async (req, res) => {

  // get user input from login form
  const { email, password } = req.body

  // get token stored on client
  let token
  const authHeader = req.headers.authorization
  if (
    authHeader &&
    authHeader.split(' ').length == 2 &&
    authHeader.split(' ')[0] == 'Bearer'
  ) {
    token = authHeader.split(' ')[1]
  }

  // user is attempting to login with email and password
  if (email && password) {

    // get user from database
    let user = await User.findOne({ email }).lean()

    // check user input against db
    if (user && compareSync(password, user.password)) {

      // add id field, remove _id and password
      user.id = user._id
      delete user._id
      delete user.password
      delete user.archived
      delete user['__v']

      // json web token to hold session on client
      const token = jwt.sign({ uid: user.id }, 'secret', { expiresIn: '14 days'})

      // return token to client
      return res.send({ token, user })

    } else {

      // return error, email/pw combination not found
      return res.sendStatus(404)

    }

  // user is attempting to login with a token
  } else if (token) {

    try {

      // decode token
      const decodedToken = jwt.verify(token, 'secret')

      // fetch user from db
      const user = await User.findOne({ _id: decodedToken.uid }).lean()

      // no user found with id
      if (!user) return res.sendStatus(404)

      // add id field, remove _id and password
      user.id = user._id
      delete user._id
      delete user.password
      delete user.archived
      delete user['__v']

      // give client a new refreshed token
      const refreshedToken = jwt.sign({ uid: user.id }, 'secret', { expiresIn: '14 days' })

      return res.send({ token: refreshedToken, user })

    } catch(error) {

      // token was invalid
      return res.status(404).send(error)

    }

  }

})


module.exports = router
