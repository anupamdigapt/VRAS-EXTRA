const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const { Client } = require('./Client');

const Target = sequelize.define('targets', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    clientId: {
        type: DataTypes.BIGINT,
        // references: {
        //     model: 'Client', // name of the target model
        //     key: 'id', // name of the target column
        // },
        allowNull: true
    },
    targetType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    latitude: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: true
    },
    longitude: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: true
    },
    heightAboveGround: {
        type: DataTypes.STRING,
        allowNull: true
    },
    difficulty: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    health: {
        type: DataTypes.STRING,
        allowNull: true
    },
    size: {
        type: DataTypes.STRING,
        allowNull: true
    },
    behavior: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    weaknesses: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    armament: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    armor: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    vulnerabilities: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    movementPattern: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    visualAppearance: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    soundAppearance: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    threatLevel: {
        type: DataTypes.STRING,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

Target.belongsTo(Client, {
    foreignKey: 'clientId',
    targetKey: 'id',
    onUpdate: 'CASCADE', // 'NO ACTION',
    onDelete: 'SET NULL' // 'RESTRICT'
});
// const users = await Target.findAll({
//     include: ['Client'], // Include the associated Client model
// });

Client.hasMany(Target, {
    foreignKey: 'clientId',
    targetKey: 'id',
    onUpdate: 'CASCADE', // 'NO ACTION',
    onDelete: 'SET NULL' // 'RESTRICT'
});
// const clients = await Client.findAll({
//     include: ['Target'], // Include the associated Target model
// });

sequelize.sync({
    // alter: true
}).then(() => {
    console.log('Table synchronized successfully!');
}).catch((error) => {
    console.error('Unable to synchronized table: ', error);
});

module.exports = {
    Target
};