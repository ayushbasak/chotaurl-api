const express = require('express')
const router = express.Router()

const crud = require('../database/Urls.CRUD.database')
const crud_metrics = require('../database/Url_metrics.CRUD.database')

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

    try {
        let new_url = undefined
        if(flavor === undefined)
            new_url = await crud.insert(url)
        else
            new_url = await crud.insertCheck(url, flavor)
        res.send({
            url: currURL + new_url.endpoint,
            epoch: new_url.epoch
        })
    } catch (err) {
        ERROR_CREATION.message = err.message
        res.send(ERROR_CREATION);
        console.log('Error Happened: ', ERROR_CREATION);
    }
})


router.route('/:id')
    .get(async (req, res)=>{
        try {
            const service = await crud.findThis(req.params.id);
            if(service === null){
                res.send(ERROR_INVALID_URL)
                return
            }
            await crud.updateClicks(req.params.id);
            await crud_metrics.clicked_url(req.params.id);
            res.redirect(service.url);
        } catch (err) {
            ERROR_INVALID_URL.message = err.message;
            res.json(ERROR_INVALID_URL);
        }
    })

module.exports = router