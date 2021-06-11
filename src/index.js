/**
 * Globals
 */
const PORT = process.env.PORT || 5000
require('dotenv').config()
const cors = require('cors')

/**
 * Express App
 */

const express = require('express')
const app = express()
app.use(express.json())
app.use(cors())

app.listen(PORT, ()=>{
    console.log(`Server Open at PORT: ${PORT}`)
})

/**
 * Admin Authentcation for maintainance privileges
 */
const { auth0, config_auth0 } = require('./admin/admin.auth')
app.use(auth0(config_auth0))

const router = require('./routes/routes')
/**
 * Routes
 */

app.use('/', router)