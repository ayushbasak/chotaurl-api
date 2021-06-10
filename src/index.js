/**
 * Globals
 */
const { ERROR_CREATION, ERROR_INVALID_URL,
    ERROR_AUTHENTICATION, ERROR_INVALID_USER} = require('./errors/errors')

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
const { insert, insertCheck, findThis,
     countAll, getHostNames, deleteAllData } = require('./database/CRUD.database')

const { auth0, config_auth0 } = require('./admin/admin.auth')
app.use(auth0(config_auth0))
/**
 * Routes
 */

app.route('/')
.get((req, res)=>{
        if(req.oidc.isAuthenticated())
            res.send('visit /admin')
        else{
            // Database Authentication
            if(auth()){
                console.log(`Database Connected`)
                res.send('Database Connected')
            }
            else{
                res.send(`INVALID REQUEST`)
            }
        }
    })
    .post(async (req, res)=>{
        const currURL = req.protocol + '://' + req.get('host') + req.originalUrl

        const data = req.body
        const url = data.url
        const flavor = data.flavor
        if(url === undefined){
            res.send(ERROR_INVALID_URL)
            return
        }
        if(validURL(url) === null){
            res.send(ERROR_INVALID_URL)
            return
        }
        let result = undefined
        if(flavor === undefined)
            result = await insert(url)
        else
            result = await insertCheck(url, flavor)
        
        if(result == undefined)
            res.json(ERROR_CREATION)
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
            res.json(ERROR_INVALID_URL)
        else{
            res.redirect(service)
        }
    })

app.route('/about')
    .get( async (req, res)=>{
        let result =await  countAll()
        let hostNames = await getHostNames()
        hostNames=  Array.from(hostNames)
        res.json(
            {
                count: result,
                hostNames: hostNames,
                countHostNames: hostNames.length
            }
        )
    })

app.route('/admin')
    .get((req, res)=>{
        if(req.oidc.isAuthenticated()){
            const user = req.oidc.user.sub.split('|')[1]
            if (user === process.env.ADMIN){
                deleteAllData()
                res.send('deleted all data')
            }
            else
                res.send(ERROR_INVALID_USER)
        }
        else
            res.send(ERROR_AUTHENTICATION)
    })