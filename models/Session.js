const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const { Client } = require('./Client');
const { User } = require('./User');

const Session = sequelize.define('sessions', {
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
    userId: {
        type: DataTypes.BIGINT,
        // references: {
        //     model: 'User', // name of the target model
        //     key: 'id', // name of the target column
        // },
        allowNull: true
    },
    sessionType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    startAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    outcome: {
        type: DataTypes.ENUM('success', 'failure'),
        defaultValue: 'failure',
        allowNull: true
    },
    score: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: true
    },
    timeOfDay: {
        type: DataTypes.STRING,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    participants: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    sessionRecording: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

Session.belongsTo(Client, {
    foreignKey: 'clientId',
    targetKey: 'id',
    onUpdate: 'CASCADE', // 'NO ACTION',
    onDelete: 'SET NULL' // 'RESTRICT'
});
// const users = await Session.findAll({
//     include: ['Client'], // Include the associated Client model
// });

Client.hasMany(Session, {
    foreignKey: 'clientId',
    targetKey: 'id',
    onUpdate: 'CASCADE', // 'NO ACTION',
    onDelete: 'SET NULL' // 'RESTRICT'
});
// const clients = await Client.findAll({
//     include: ['Session'], // Include the associated Session model
// });

Session.belongsTo(User, {
    foreignKey: 'userId',
    targetKey: 'id',
    onUpdate: 'CASCADE', // 'NO ACTION',
    onDelete: 'SET NULL' // 'RESTRICT'
});
// const sessions = await Session.findAll({
//     include: ['User'], // Include the associated User model
// });

User.hasMany(Session, {
    foreignKey: 'userId',
    targetKey: 'id',
    onUpdate: 'CASCADE', // 'NO ACTION',
    onDelete: 'SET NULL' // 'RESTRICT'
});
// const users = await User.findAll({
//     include: ['Session'], // Include the associated Session model
// });

sequelize.sync({
    // alter: true
}).then(() => {
    console.log('Table synchronized successfully!');
}).catch((error) => {
    console.error('Unable to synchronized table: ', error);
});

module.exports = {
    Session
};