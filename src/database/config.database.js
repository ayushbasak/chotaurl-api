const { Sequelize } = require('sequelize')
const sql = new Sequelize(process.env.DB_URI, {dialect: 'postgres'})

const auth = async ()=>{
    let res = false
    await sql.authenticate()
        .then(response => res = true)
        .catch(err => console.log(err))

    return res
}

module.exports = {auth: auth}