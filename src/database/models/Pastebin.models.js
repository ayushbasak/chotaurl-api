const { db } = require('../config.database')
const { DataTypes } = require('sequelize')

const pastebin = db.define('pastebin', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    content: {
        type: DataTypes.TEXT,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    epoch: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    fetches: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    }
}, {
    tableName: 'pastebin',
    timestamps: false,
    freezeTableName: true,
});

module.exports = { pastebin };