const { Joi } = require('celebrate')
const { hashSync, compareSync } = require('bcrypt')
const { Models: { User }} = require('./../db/models')
const { variableNames: { authTokenKey }, routes: { 
	registerAndLoginRoute,
	loginWithTokenRoute, 
	loginWithEmailAndPassword,
}} = require('../../constants')
const { createAuthToken, decodeAuthToken } = require('./../utils')
  
module.exports = [
    {
		route: registerAndLoginRoute,
		method: 'post',
		description: 'creates a new user with a unique email and password combination',
		inputSchema: {
			body: Joi.object({
				emailAddress: Joi.string().required(),
				password: Joi.string().required(),
			})
		},
		controller: async (req) => {
				let newUserArgs = req.body
			
				// encrypt password
				newUserArgs.password = hashSync(newUserArgs.password, 10)
			
				// create user
				let user = await User.create(newUserArgs)
			
				// give client a new refreshed token
				const token = createAuthToken({ user })
		
				// return response
				return { [authTokenKey]: token }
		
		},
		outputSchema: Joi.object({
			[authTokenKey]: Joi.string()
		}),
		output: authTokenKey
	},
	{
		route: loginWithEmailAndPassword,
		method: 'post',
		description: 'allows user to login with email and password credentials',
		inputSchema: {
			body: Joi.object({
				password: Joi.string().required(),
				emailAddress: Joi.string().required(),
			})
		},
		controller: async (req) => {
				// get user input from login form
				const { emailAddress, password } = req.body
			  
				// get user from database
				const user = await User.findOne({ emailAddress }).lean()
			  
				// check user credentials
				if (!!user && compareSync(password, user.password)) {
			  
				  // create json web token to maintain session on client
				  const token = createAuthToken({ user })
			  
				  // return token to client
				  return { [authTokenKey]: token }
			  
				} else {
			  
				  // return error, email/pw combination not found
				  return { [authTokenKey]: undefined }
				}
			
		},
		outputSchema: Joi.object({
			[authTokenKey]: Joi.string()
		}),
		output: authTokenKey
	},
	{
		route: loginWithTokenRoute,
		method: 'post',
		description: 'allows user to login with header token',
		inputSchema: {
			headers: Joi.object({
				[authTokenKey]: Joi.string().required(),
			})
		},
		controller: async (req) => {
				// get user input from login form
				const token = req.headers[authTokenKey]

				if (!token) return { [authTokenKey]: undefined }
			
				// decode token
				const decodedToken = decodeAuthToken({ token })
			
				// fetch user from db
				const user = await User.findById(decodedToken.uid).lean()
			
				// no user found with id
				if (!user) return { [authTokenKey]: undefined }
			
				// give client a new refreshed token
				const refreshedToken = createAuthToken({ user })
			
				return { [authTokenKey]: refreshedToken }
		  
		  },
		  outputSchema: Joi.object({
			[authTokenKey]: Joi.string()
		}),
		  output: authTokenKey
	}
]