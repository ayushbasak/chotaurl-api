const { db } = require('../config.database')
const { DataTypes } = require('sequelize')

const urls = db.define('urls', {
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

module.exports = { urls }