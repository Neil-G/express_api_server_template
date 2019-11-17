const { Joi } = require('celebrate')
const { hashSync, compareSync } = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Models: { User }} = require('./../db/models')
const { routes: { 
	registerAndLoginRoute,
	loginWithTokenRoute, 
	loginWithEmailAndPassword,
}} = require('../../constants')
  
module.exports = [
    {
		route: registerAndLoginRoute,
		method: 'post',
		description: 'creates a new user with a unique email and password combination',
		celebrate: {
			body: Joi.object({
				emailAddress: Joi.string().required(),
				password: Joi.string().required(),
			})
		},
		controller: async (req, res) => {
			try {
				let newUserArgs = req.body
			
				// encrypt password
				newUserArgs.password = hashSync(newUserArgs.password, 10)
			
				// create user
				let user = await User.create(newUserArgs)
			
				// give client a new refreshed token
				const token = jwt.sign({ uid: user.id }, 'secret', { expiresIn: '14 days' })
		
				// return response
				return res.send({ token })
			} catch (e) {
				console.log(error)
				return res.send(error)
			}
		},
		output: `token`
	},
	{
		route: loginWithEmailAndPassword,
		method: 'post',
		description: 'allows user to login with email and password credentials',
		celebrate: {
			body: Joi.object({
				password: Joi.string().required(),
				emailAddress: Joi.string().required(),
			})
		},
		controller: async (req, res) => {
			try {
				// get user input from login form
				const { emailAddress, password } = req.body
			  
				// get user from database
				const user = await User.findOne({ emailAddress }).lean()
			  
				// check user credentials
				if (!!user && compareSync(password, user.password)) {
			  
				  // create json web token to maintain session on client
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
			} catch (error) {
				console.log(error)
				return res.send(error)
			}
		},
		output: `token`
	},
	{
		route: loginWithTokenRoute,
		method: 'post',
		description: 'allows user to login with header token',
		celebrate: {
			headers: Joi.object({
				token: Joi.string().required(),
			})
		},
		controller: async (req, res) => {
			try {
				// get user input from login form
				const { token } = req.headers
			
				if (!token) return res.send({ token: undefined })
			
				// decode token
				const decodedToken = jwt.verify(token, 'secret')
			
				// fetch user from db
				const user = await User.findById(decodedToken.uid).lean()
			
				// no user found with id
				if (!user) return res.send({ token: undefined })
			
				// give client a new refreshed token
				const refreshedToken = jwt.sign({ uid: user._id }, 'secret', { expiresIn: '14 days' })
			
				res.send({ token: refreshedToken })
		  
			} catch(error) {
				console.log(e)
				return res.send(e)
			}
		  },
		  output: 'token'
	}
]