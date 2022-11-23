const { Sequelize } = require('sequelize')
const db = new Sequelize(process.env.DB_URI, {dialect: 'postgres'})

const databaseAuth = async ()=>{
    try {
        await db.authenticate();
        console.log('Connection has been established successfully.');
    } catch (err) {
        throw err;
    }
}

module.exports = { db, databaseAuth }