const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const { Client } = require('./Client');
const { Scenario } = require('./Scenario');
const { Session } = require('./Session');
const { User } = require('./User');

const PerformanceMetric = sequelize.define('performanceMetrics', {
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
        allowNull: false
    },
    scenarioId: {
        type: DataTypes.BIGINT,
        // references: {
        //     model: 'Scenario', // name of the target model
        //     key: 'id', // name of the target column
        // },
        allowNull: false
    },
    sessionId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        // references: {
        //     model: 'Session', // name of the target model
        //     key: 'id', // name of the target column
        // },
        allowNull: false
    },
    userId: {
        type: DataTypes.BIGINT,
        // references: {
        //     model: 'User', // name of the target model
        //     key: 'id', // name of the target column
        // },
        allowNull: false
    },
    targetsHit: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    shotsFired: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    shotsHit: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    headshots: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    kills: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    neutralised: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    deaths: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    damageCaused: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    damageTaken: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    friendlyDamage: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    timeSurvived: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    pointsEarned: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: true
    },
    challengesCompleted: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    medalsEarned: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    achievementsUnlocked: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    xpLevel: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: true
    },
    xpProgress: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: true
    }
});

PerformanceMetric.belongsTo(Client, {
    foreignKey: 'clientId',
    targetKey: 'id',
    onUpdate: 'CASCADE', // 'NO ACTION',
    // onDelete: 'SET NULL' // 'RESTRICT'
});
// const performanceMetrics = await PerformanceMetric.findAll({
//     include: ['Client'], // Include the associated Client model
// });

PerformanceMetric.belongsTo(Scenario, {
    foreignKey: 'scenarioId',
    targetKey: 'id',
    onUpdate: 'CASCADE', // 'NO ACTION',
    // onDelete: 'SET NULL' // 'RESTRICT'
});
// const performanceMetrics = await PerformanceMetric.findAll({
//     include: ['Scenario'], // Include the associated Scenario model
// });

PerformanceMetric.belongsTo(Session, {
    foreignKey: 'sessionId',
    targetKey: 'id',
    onUpdate: 'CASCADE', // 'NO ACTION',
    // onDelete: 'SET NULL' // 'RESTRICT'
});
// const performanceMetrics = await PerformanceMetric.findAll({
//     include: ['Session'], // Include the associated Session model
// });

PerformanceMetric.belongsTo(User, {
    foreignKey: 'userId',
    targetKey: 'id',
    onUpdate: 'CASCADE', // 'NO ACTION',
    // onDelete: 'SET NULL' // 'RESTRICT'
});
// const performanceMetrics = await PerformanceMetric.findAll({
//     include: ['User'], // Include the associated User model
// });

sequelize.sync({
    // alter: true
}).then(() => {
    console.log('Table synchronized successfully!');
}).catch((error) => {
    console.error('Unable to synchronized table: ', error);
});

module.exports = {
    PerformanceMetric
};