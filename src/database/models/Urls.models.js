const {Sequelize, DataTypes, Op} = require('sequelize')
const sql = new Sequelize(process.env.DB_URI, {dialect: 'postgres'})

const urls = sql.define('urls', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    epoch:{
        type: DataTypes.BIGINT,
        allowNull: false
    }
}, {
    tableName: 'urls',
    freezeTableName: true, timestamps: false})

module.exports = {urls: urls, Op: Op}