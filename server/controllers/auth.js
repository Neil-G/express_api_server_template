const { Joi } = require('celebrate')
var FB = require('fb')
const { hashSync, compareSync } = require('bcrypt')
const { Models: { User }} = require('./../db/models')
const { variableNames: { authTokenKey }, routes: { 
	registerAndLoginRoute,
	loginWithTokenRoute, 
	loginWithEmailAndPassword,
}} = require('../../constants')
const { createAuthToken, decodeAuthToken } = require('./../utils')
  
FB.options({
    appId:          '1397238603644248',
	appSecret: 		process.env.FB_APP_SECRET
})

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
				if (!!user && !!user.password && compareSync(password, user.password)) {
			  
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
	},
	{
		route: '/api/social-auth/facebook-login',
		method: 'post',
		description: 'login or register with facebook',
		inputSchema: {
			body: Joi.object({
				facebookUserId: Joi.string().required(),
				accessToken: Joi.string().required(),
			})
		},
		controller: async (req, res) => {
			const { facebookUserId, accessToken } = req.body
			FB.setAccessToken(accessToken)
			await FB.api(facebookUserId, { fields: ['id', 'first_name', 'last_name', 'email'] }, async (response) => {
				if(!response || response.error) {
				 console.log(!response ? 'error occurred' : response.error);
				 return;
				}
				const { email, first_name, last_name } = response
				const user = await User.findOne({ emailAddress: email }).lean()
				// Create a user that doesn't exist
				if (!user) {
					const newUser = await User.create({
						firstName: first_name,
						lastName: last_name,
						emailAddress: email,
						isEmailAddressVerified: true,
						facebookUserId,
						facebookAccessToken: accessToken
					})
					const token = await createAuthToken({ user: newUser })
					return await res.send({ [authTokenKey]: token })
				// Update existing user
				} else {
					await User.findByIdAndUpdate(user._id, {
						$set: {
							firstName: user.firstName || first_name,
							lastName: user.lastName || last_name,
							isEmailAddressVerified: true,
							facebookUserId,
							facebookAccessToken: accessToken
						}
					})
					const token = await createAuthToken({ user })
					return await res.send({ [authTokenKey]: token })
				}
			  })
		},
		outputSchema: Joi.object({
			authTokenKey: Joi.string()
		}),
		overrideResponse: true,
	},
	{
		route: '/api/social-auth/google-login',
		method: 'post',
		description: 'login or register with google',
		inputSchema: {
			body: Joi.object({
				googleUserId: Joi.string().required(),
				emailAddress: Joi.string().required(),
				firstName: Joi.string().required(),
				lastName: Joi.string().required(),
			})
		},
		controller: async (req, res) => {
			const { googleUserId, emailAddress, firstName, lastName } = req.body
			const user = await User.findOne({ emailAddress }).lean()
			// Create a user that doesn't exist
			if (!user) {
				const newUser = await User.create({
					firstName: firstName,
					lastName: lastName,
					emailAddress,
					isEmailAddressVerified: true,
					googleUserId,
				})
				const token = await createAuthToken({ user: newUser })
				return await res.send({ [authTokenKey]: token })
			// Update existing user
			} else {
				await User.findByIdAndUpdate(user._id, {
					$set: {
						firstName: user.firstName || firstName,
						lastName: user.lastName || lastName,
						isEmailAddressVerified: true,
						googleUserId,
					}
				})
				const token = await createAuthToken({ user })
				return await res.send({ [authTokenKey]: token })
			}
		},
		outputSchema: Joi.object({
			[authTokenKey]: Joi.string()
		}),
		overrideResponse: true,
	}
]