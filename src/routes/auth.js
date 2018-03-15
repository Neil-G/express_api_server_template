const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')


router.post('/login', (req, res) => {
  res.sendStatus(200)
})


module.exports = router
