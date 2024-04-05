const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const { Client } = require('./Client');
const { Session } = require('./Session');

const Scenario = sequelize.define('scenarios', {
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
    sessionId: {
        type: DataTypes.BIGINT,
        // references: {
        //     model: 'Session', // name of the target model
        //     key: 'id', // name of the target column
        // },
        allowNull: true
    },
    scenarioType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    environment: {
        type: DataTypes.STRING,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    timeLimit: {
        type: DataTypes.STRING,
        allowNull: true
    },
    difficulty: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    objective: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    hazards: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    challenges: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    requiredSkills: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    rewards: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

Scenario.belongsTo(Client, {
    foreignKey: 'clientId',
    targetKey: 'id',
    onUpdate: 'CASCADE', // 'NO ACTION',
    onDelete: 'SET NULL' // 'RESTRICT'
});
// const users = await Scenario.findAll({
//     include: ['Client'], // Include the associated Client model
// });

Client.hasMany(Scenario, {
    foreignKey: 'clientId',
    targetKey: 'id',
    onUpdate: 'CASCADE', // 'NO ACTION',
    onDelete: 'SET NULL' // 'RESTRICT'
});
// const clients = await Client.findAll({
//     include: ['Scenario'], // Include the associated Scenario model
// });

Scenario.belongsTo(Session, {
    foreignKey: 'sessionId',
    targetKey: 'id',
    onUpdate: 'CASCADE', // 'NO ACTION',
    onDelete: 'SET NULL' // 'RESTRICT'
});
// const scenarios = await Scenario.findAll({
//     include: ['Session'], // Include the associated Session model
// });

Session.hasMany(Scenario, {
    foreignKey: 'sessionId',
    targetKey: 'id',
    onUpdate: 'CASCADE', // 'NO ACTION',
    onDelete: 'SET NULL' // 'RESTRICT'
});
// const sessions = await Session.findAll({
//     include: ['Scenario'], // Include the associated Scenario model
// });

sequelize.sync({
    // alter: true
}).then(() => {
    console.log('Table synchronized successfully!');
}).catch((error) => {
    console.error('Unable to synchronized table: ', error);
});

module.exports = {
    Scenario
};