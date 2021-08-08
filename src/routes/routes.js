const express = require('express')
const { requiresAuth } = require('express-openid-connect')
const router = express.Router()

const { databaseAuth } = require('../database/config.database')
const urlsCRUD = require('../database/Urls.CRUD.database')
const pastebinCRUD = require('../database/Pastebin.CRUD.database')
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

router.route('/q/')
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
            result = await urlsCRUD.insert(url)
        else
            result = await urlsCRUD.insertCheck(url, flavor)
        
        if(result == undefined)
            res.json(ERROR_CREATION)
        else{
            data.shortenedURL = currURL + result.endpoint
            data.epoch = result.epoch
            res.json(data)
        }
    })

router.route('/p/')
    .post(async (req, res)=>{
        const currURL = 'https://' + req.get('host') + req.originalUrl

        const data = req.body
        const title = data.title
        const content = data.content
        const language = data.language
        const flavor = data.flavor

        let result = undefined
        if(flavor === undefined)
            result = await pastebinCRUD.insert(title, content, language)
        else
            result = await pastebinCRUD.insertCheck(title, content, language, flavor)
        
        if(result == undefined)
            res.json(ERROR_CREATION)
        else{
            const endpoint = result.endpoint
            result = await pastebinCRUD.findThis(result.endpoint)
            result.url = currURL + endpoint
            res.json(result)
        }
    })

router.route('/q/:id')
    .get(async (req, res)=>{
        const service = await urlsCRUD.findThis(req.params.id)
        if(service == undefined)
            res.json(ERROR_INVALID_URL)
        else{
            res.redirect(service)
        }
    })

router.route('/p/:id')
    .get(async (req, res)=>{
        const service = await pastebinCRUD.findThis(req.params.id)
        if(service == undefined)
            res.json(ERROR_INVALID_URL)
        else{
            res.json(service)
        }
    })


router.route('/about/q')
    .get( async (req, res)=>{
        let result =await  urlsCRUD.countAll()
        let hostNames = await urlsCRUD.getHostNames()
        hostNames=  Array.from(hostNames)
        res.json(
            {
                count: result,
                hostNames: hostNames,
                countHostNames: hostNames.length
            }
        )
    })

router.route('/about/p')
    .get( async (req, res)=>{
        let result = await pastebinCRUD.countAll()
        res.json({
            count: result
        })
    })

router.route('/admin', requiresAuth)
    .get(async (req, res)=>{
        if(req.oidc.isAuthenticated()){
            const user = req.oidc.user.sub.split('|')[1]
            if (user === process.env.ADMIN){
                await urlsCRUD.deleteAllData()
                await pastebinCRUD.deleteAllData()
                res.send('deleted all data')
            }
            else
                res.send(ERROR_INVALID_USER)
        }
        else
            res.send(ERROR_AUTHENTICATION)
    })
module.exports = router