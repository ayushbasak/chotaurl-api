const express = require('express')
const router = express.Router()
const crud = require('../database/Pastebin.CRUD.database')
const crud_metrics = require('../database/Pastebin_metrics.CRUD.database')

const { 
    ERROR_CREATION,
    ERROR_INVALID_URL
} = require('../errors/errors')

router.route('/')
    .post(async (req, res)=>{
        const data = req.body
        const title = data.title
        const content = data.content
        const passcode = data.passcode

        let result = await crud.insert(title, 
                        content,
                        passcode === undefined ? '' : passcode)
        
        if(result == undefined)
            res.json(ERROR_CREATION)
        else{
            output = await crud.findThis(result.endpoint)
            // output.passcode = passcode
            output.code = result.endpoint
            res.json(output)
        }
    })

router.route('/:id')
    .get(async (req, res)=>{
        try {
            const service = await crud.findThis(req.params.id);
            // if(service == undefined){
            //     res.json(ERROR_CREATION)
            //     return
            // }
            await crud.updateFetches(req.params.id)
            await crud_metrics.fetch_pastebin(req.params.id)
            res.json(service)
        } catch (err) {
            res.json(ERROR_CREATION)
        }
    })


module.exports = router