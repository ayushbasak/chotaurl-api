const express = require('express')
const router = express.Router()

const urlsCRUD = require('../database/Urls.CRUD.database')
const pastebinCRUD = require('../database/Pastebin.CRUD.database')

router.route('/q')
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

router.route('/p')
    .get( async (req, res)=>{
        let result = await pastebinCRUD.countAll()
        res.json({
            count: result
        })
    })

module.exports = router