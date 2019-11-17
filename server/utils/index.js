const jwt = require('jsonwebtoken')
const jwtSecret = process.env.AUTH_SECRET || 'secret'

exports.createAuthToken = ({ user }) => {
    return jwt.sign({ uid: user._id }, jwtSecret, { expiresIn: '14 days' })
}

exports.decodeAuthToken = ({ token }) => {
    return jwt.verify(token, jwtSecret)
}