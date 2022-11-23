const express = require('express')
const router = express.Router()

const urlsCRUD = require('../database/Urls.CRUD.database')
const url_metricsCRUD = require('../database/Url_metrics.CRUD.database');
const pastebinCRUD = require('../database/Pastebin.CRUD.database')

router.route('/q')
    .get( async (req, res)=>{
        let result =await  urlsCRUD.countAll()
        // let hostNames = await urlsCRUD.getHostNames()
        // hostNames=  Array.from(hostNames)
        res.json(
            {
                count: result,
                hostNames: [],
                countHostNames: 0
            }
        )
    })

router.route('/q/:id')
    .get( async (req, res)=>{
        try {
            let metrics = await url_metricsCRUD.getMetrics(req.params.id);
            res.send(metrics)
        }
        catch(err){
            res.json(err);
        }
    })

router.route('/p')
    .get( async (req, res)=>{
        let result = await pastebinCRUD.countAll()
        res.json({
            count: result
        })
    })

module.exports = router