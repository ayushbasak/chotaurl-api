const { db } = require('../config.database')
const { DataTypes } = require('sequelize')
const { pastebin } = require('./Pastebin.models');

const pastebin_metrics = db.define('urls', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    pastebin_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    epoch: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
}, {
    tableName: 'pastebin_metrics',
    freezeTableName: true, timestamps: false
})
// url_metrics.belongsTo(urls, {foreignKey: 'url_id', targetKey: 'id'})
module.exports = { pastebin_metrics }