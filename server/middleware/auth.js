const { decodeAuthToken } = require('./../utils')
const { variableNames: { authTokenKey }} = require('./../../constants')

/*
|--------------------------------------------------------------------------
| Determine if valid user
|--------------------------------------------------------------------------
*/

module.exports.isLoggedIn = function isLoggedIn (req, res, next) {
    try {
        const token = req.headers[authTokenKey]
    
        // check that a token is included in the header
        if (!token) {
            res.status(401)
            return res.json({ message: 'user is not authenticated' })
        }
    
        // decode the json webtoken
        decodeAuthToken({ token })
        next()

    } catch (error) {
        console.log(error)
        res.status(401)
        res.json({ message: 'user is not authenticated' })
    }

}