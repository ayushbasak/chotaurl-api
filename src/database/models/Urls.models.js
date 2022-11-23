const { db } = require('../config.database')
const { DataTypes } = require('sequelize')
const { url_metrics } = require('./url_metrics')

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
    },
    clicks:{
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'urls',
    freezeTableName: true, timestamps: false
})

urls.hasMany(url_metrics, {foreignKey: 'url_id', sourceKey: 'id'})

module.exports = { urls }