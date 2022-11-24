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

const { databaseAuth } = require('./src/database/config.database')

app.listen(PORT, ()=>{
    console.log(databaseAuth());
    console.log(`Server Open at PORT: ${PORT}`)
})

const pastebinRouter = require('./src/routes/pastebin.routes')
const chotaurlRouter = require('./src/routes/chotaurl.routes')
const aboutRouter = require('./src/routes/about.routes')
/**
 * Routes
 */

app.use('/p', pastebinRouter)
app.use('/q', chotaurlRouter)
app.use('/about', aboutRouter)