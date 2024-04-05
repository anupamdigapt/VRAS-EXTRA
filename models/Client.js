const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const { Subscription } = require('./Subscription');

const Client = sequelize.define('clients', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    subscriptionId: {
        type: DataTypes.BIGINT,
        // references: {
        //     model: 'Subscription', // name of the target model
        //     key: 'id', // name of the target column
        // },
        allowNull: true
    },
    numberOfUsers: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        // unique: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        // unique: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        // unique: true,
        allowNull: false
    },
    mobile: {
        type: DataTypes.STRING,
        // unique: true,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true
    },
    postalCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    startAt: {
        // type: DataTypes.DATE,
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    endAt: {
        // type: DataTypes.DATE,
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    payStatus: {
        type: DataTypes.ENUM('paid', 'initiate', 'due'),
        defaultValue: 'due',
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'delete'),
        defaultValue: 'active',
        allowNull: true
    }
});

Client.belongsTo(Subscription, {
    foreignKey: 'subscriptionId',
    targetKey: 'id',
    onUpdate: 'CASCADE', // 'NO ACTION',
    onDelete: 'SET NULL' // 'RESTRICT'
});
// const clients = await Client.findAll({
//     include: ['Subscription'], // Include the associated Subscription model
// });

sequelize.sync({
    // alter: true
}).then(() => {
    console.log('Table synchronized successfully!');
}).catch((error) => {
    console.error('Unable to synchronized table: ', error);
});

module.exports = {
    Client
};