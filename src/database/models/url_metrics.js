const { db } = require('../config.database')
const { DataTypes } = require('sequelize')
const { urls } = require('./Urls.models')

const url_metrics = db.define('urls', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    url_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    epoch: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
}, {
    tableName: 'url_metrics',
    freezeTableName: true, timestamps: false
})
// url_metrics.belongsTo(urls, {foreignKey: 'url_id', targetKey: 'id'})
module.exports = { url_metrics }