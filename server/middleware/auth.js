const jwt = require('jsonwebtoken')

module.exports.isLoggedIn = (req, res, next) => {
    try {
        const token = req.headers.token
    
        // check that a token is included in the header
        if (!token) {
            res.status(401)
            res.json({ message: 'user is not authenticated' })
        }
    
        // decode the json webtoken
        jwt.verify(token, 'secret')

        next()

    } catch (err) {
        console.log(err)
        res.status(401)
            res.json({ message: 'user is not authenticated' })
    }

}