/**
 * Globals
 */
const ERROR_CREATION = 1
const ERROR_INVALID_URL = 2 

const validURL = (url)=>{
   let regex = RegExp('^(ftp|https?)://', 'g')
   return regex.exec(url)
}

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

const { auth } = require('./database/config.database')
const { insert, insertCheck, findThis } = require('./database/CRUD.database')

/**
 * Routes
 */

app.route('/')
    .get((req, res)=>{
        if(auth()){
            console.log(`Database Connected`)
            res.send('Database Connected')
        }
        else{
            res.send(`INVALID REQUEST`)
        }
    })
    .post(async (req, res)=>{
        const currURL = req.protocol + '://' + req.get('host') + req.originalUrl

        const data = req.body
        const url = data.url
        const flavor = data.flavor
        if(url === undefined){
            res.send({errorId: ERROR_INVALID_URL, error: 'Missing URL parameter'})
            return
        }
        if(validURL(url) === null){
            res.send({errorId: ERROR_INVALID_URL, error: 'Invalid URL'})
            return
        }
        let result = undefined
        if(flavor === undefined)
            result = await insert(url)
        else
            result = await insertCheck(url, flavor)
        
        if(result == undefined)
            res.json({errorId: ERROR_CREATION, error: 'Could not create Shortened URL'})
        else{
            data.shortenedURL = currURL + "q/" + result.endpoint
            data.epoch = result.epoch
            res.json(data)
        }
    })

app.route('/q/:id')
    .get(async (req, res)=>{
        const service = await findThis(req.params.id)
        if(service == undefined)
            res.json({errorId: ERROR_INVALID_URL, error: 'Invalid Shortened URL'})
        else{
            res.redirect(service)
        }
    })