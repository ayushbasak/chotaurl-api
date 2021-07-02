const { Sequelize } = require('sequelize')
const db = new Sequelize(process.env.DB_URI, {dialect: 'postgres'})

const databaseAuth = async ()=>{
    let res = false
    await db.authenticate()
        .then(response => res = true)
        .catch(err => console.log(err))

    return res
}

module.exports = { db, databaseAuth }