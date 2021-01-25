const express = require('express')
const authController = require('./controllers/authController')

const app = express()

app.use(express.json())

app.use('/auth', authController)

module.exports = app
