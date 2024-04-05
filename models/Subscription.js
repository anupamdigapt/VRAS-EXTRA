const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Subscription = sequelize.define('subscriptions', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        // unique: true,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: false
    },
    numberOfDays: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    numberOfUsers: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

sequelize.sync({
    // alter: true
}).then(() => {
    console.log('Table synchronized successfully!');
}).catch((error) => {
    console.error('Unable to synchronized table: ', error);
});

module.exports = {
    Subscription
};