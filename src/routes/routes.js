const express = require('express')
const { requiresAuth } = require('express-openid-connect')
const router = express.Router()

const { databaseAuth } = require('../database/config.database')
const crud = require('../database/CRUD.database')
const { 
    ERROR_CREATION,
    ERROR_INVALID_URL,
    ERROR_AUTHENTICATION,
    ERROR_INVALID_USER
} = require('../errors/errors')


const validURL = (url)=>{
   let regex = RegExp('^(ftp|https?)://', 'g')
   return regex.exec(url)
}


router.route('/')
.get((req, res)=>{
        if(req.oidc.isAuthenticated())
            res.send('visit <a href = "/admin">/admin</a>')
        else{
            // Database Authentication
            if(databaseAuth()){
                res.send(`Database Connected for ${req.socket.remoteAddress}`)
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
            result = await crud.insert(url)
        else
            result = await crud.insertCheck(url, flavor)
        
        if(result == undefined)
            res.json(ERROR_CREATION)
        else{
            data.shortenedURL = currURL + "q/" + result.endpoint
            data.epoch = result.epoch
            res.json(data)
        }
    })

router.route('/q/:id')
    .get(async (req, res)=>{
        const service = await crud.findThis(req.params.id)
        if(service == undefined)
            res.json(ERROR_INVALID_URL)
        else{
            res.redirect(service)
        }
    })

router.route('/about')
    .get( async (req, res)=>{
        let result =await  crud.countAll()
        let hostNames = await crud.getHostNames()
        hostNames=  Array.from(hostNames)
        res.json(
            {
                count: result,
                hostNames: hostNames,
                countHostNames: hostNames.length
            }
        )
    })

router.route('/admin')
    .get(async (req, res)=>{
        if(req.oidc.isAuthenticated()){
            const user = req.oidc.user.sub.split('|')[1]
            if (user === process.env.ADMIN){
                await crud.deleteAllData()
                res.send('deleted all data')
            }
            else
                res.send(ERROR_INVALID_USER)
        }
        else
            res.send(ERROR_AUTHENTICATION)
    })

router.route('/test')
    .get(requiresAuth(), async (req, res)=>{
        console.log(`test`)
        res.send(`test`)
    })
module.exports = router