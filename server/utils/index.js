const jwt = require('jsonwebtoken')
const jwtSecret = process.env.AUTH_SECRET || 'secret'

/*
|--------------------------------------------------------------------------
| Handle User Token Authentication
|--------------------------------------------------------------------------
*/

exports.createAuthToken = ({ user }) => {
    return jwt.sign({ uid: user._id }, jwtSecret, { expiresIn: '14 days' })
}

exports.decodeAuthToken = ({ token }) => {
    return jwt.verify(token, jwtSecret)
}