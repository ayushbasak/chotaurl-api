const { db } = require('../config.database')
const { DataTypes , Op } = require('sequelize')

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
    passcode: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    epoch: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
}, {
    tableName: 'pastebin',
    timestamps: false,
    freezeTableName: true,
});

module.exports = { pastebin , Op};