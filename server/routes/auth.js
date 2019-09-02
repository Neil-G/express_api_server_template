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
      TOKEN LOGIN
        (Read)
********************************/
router.post('/login-with-token', async (req, res) => {

  // get user input from login form
  const { token } = req.headers

  if (!token) return res.send({ token: undefined })

  // user is attempting to login with a token
  try {

    // decode token
    const decodedToken = jwt.verify(token, 'secret')

    // fetch user from db
    const user = await User.findById(decodedToken.uid).lean()

    // no user found with id
    if (!user) return res.send({ token: undefined })

    // give client a new refreshed token
    const refreshedToken = jwt.sign({ uid: user._id }, 'secret', { expiresIn: '14 days' })

    return res.send({ token: refreshedToken })

  } catch(error) {

    // token was invalid
    return res.send({ token: undefined })

  }
})

/*
|--------------------------------------------------------------------------
| Email & Password Login
|--------------------------------------------------------------------------
*/

router.post('/login-with-email-and-password', async (req, res) => {

  // get user input from login form
  const { emailAddress, password } = req.body

  if (!emailAddress || !password) {
    return res.send({ message: 'must provide email and password' })
  }

  // get user from database
  const user = await User.findOne({ emailAddress }).lean()

  // check user input against db
  if (!!user && compareSync(password, user.password)) {

    // json web token to hold session on client
    const token = jwt.sign({ uid: user._id }, 'secret', { expiresIn: '14 days'})

    // return token to client
    return res.send({ token })

  } else {

    // return error, email/pw combination not found
    return res.send({ 
      type: 'incorrectCredentials', 
      message: 'Email and password were not valid' 
    })

  }

})

/*
|--------------------------------------------------------------------------
| Export Router
|--------------------------------------------------------------------------
*/

module.exports = router
