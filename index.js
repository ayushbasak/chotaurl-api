/**
 * Globals
 */
const PORT = process.env.PORT || 5000

const urls = [
    {
        "url": "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb.jpg"
    }
]

/**
 * Express App
 */
require('dotenv').config()
const cors = require('cors')

const express = require('express')
const app = express()
app.use(express.json())
app.use(cors())

app.listen(PORT, ()=>{
    console.log(`Server Open at PORT: ${PORT}`)
})

const {auth} = require('./database/config.database')
const { System, insert, findThis } = require('./database/CRUD.database')
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
        const data = req.body
        const url = data.url
        const result = await insert(url)
        
        if(result == undefined)
            res.send(`Could not create Shortened Url for <br>${url}`)
        else{
            data.shortenedURL = 'http://localhost:5000/' + result
            res.json(data)
        }
    })

app.route('/:id')
    .get(async (req, res)=>{
        const service = await findThis(req.params.id)
        if(service == undefined)
            res.send('Invalid Shortened URL')
        else{
            res.redirect(service)
        }
    })