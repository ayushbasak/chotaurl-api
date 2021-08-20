const express = require('express')
const router = express.Router()
const { requiresAuth } = require('express-openid-connect')

const {
    ERROR_AUTHENTICATION,
    ERROR_INVALID_USER
} = require('../errors/errors')

router.route('/admin/del', requiresAuth())
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


router.route('/', requiresAuth())
    .get(async (req, res) =>{
        if(req.oidc.isAuthenticated()){
            res.send(`
                <h1>Admin</h1>
                <div><a href = "/logout">Logout</a></div>
                <div><a href "/admin/del">Delete Data</a></div>
            `)
        }
        else{
            res.send(`
                <h1>Admin</h1>
                <a href = "/login">Login</a>
            `)
        }
    });


module.exports = router