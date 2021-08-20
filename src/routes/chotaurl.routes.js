const express = require('express')
const router = express.Router()

const crud = require('../database/Urls.CRUD.database')

const { 
    ERROR_CREATION,
    ERROR_INVALID_URL
} = require('../errors/errors')

const  validURL = (str) => {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}  

router.route('/')
.post(async (req, res)=>{
    const currURL = req.protocol + '://' + req.get('host') + req.originalUrl

    const data = req.body
    
    const url = data.url
    const flavor = data.flavor

    if(url === undefined){
        res.send(ERROR_INVALID_URL)
        return
    }
    if(!validURL(url)){
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
        data.shortenedURL = currURL + result.endpoint
        data.epoch = result.epoch
        res.json(data)
    }
})


router.route('/:id')
    .get(async (req, res)=>{
        const service = await crud.findThis(req.params.id)
        if(service == undefined)
            res.json(ERROR_INVALID_URL)
        else{
            res.redirect(service)
        }
    })

module.exports = router