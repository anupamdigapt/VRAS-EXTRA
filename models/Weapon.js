const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Weapon = sequelize.define('weapons', {
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
    generation: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    accuracy: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: true
    },
    reloadTime: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: true
    },
    damage: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: true
    },
    fireRate: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: true
    },
    recoil: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: true
    },
    magazineCapacity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true
    },
    bulletType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bulletCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true
    },
    grenadeType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    grenadeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true
    },
    weight: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: true
    },
    length: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: true
    },
    height: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: true
    },
    width: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: true
    },
    manufacturer: {
        type: DataTypes.STRING,
        allowNull: true
    },
    countryOfOrigin: {
        type: DataTypes.STRING,
        allowNull: true
    },
    yearOfManufacture: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    notes: {
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
    Weapon
};