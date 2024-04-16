// Validator
const { Validator } = require('node-input-validator');

// Common Response
const { response } = require('../../../config/response');

// Model
const { Op } = require('sequelize');
const { Weapon } = require('../../../models/Weapon');

const index = async (req, res) => {
    try {
        let {
            page,
            length
        } = req.query;
        page = page > 0 ? parseInt(page) : 1;
        length  = length > 0 ? parseInt(length) : 10;
        let offset = (page - 1) * length;

        const { count: total, rows: weapons } = await Weapon.findAndCountAll({
            order: [
                ['name', 'ASC']
            ],
            limit: length,
            offset: offset
        });

        return response(res, { weapons, total }, 'Weapons list.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const store = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            name: 'required'
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        let errors = {};
        const {
            name,
            generation,
            type,
            description,
            accuracy,
            reloadTime,
            damage,
            fireRate,
            recoil,
            magazineCapacity,
            bulletType,
            bulletCount,
            grenadeType,
            grenadeCount,
            weight,
            length,
            height,
            width,
            manufacturer,
            countryOfOrigin,
            yearOfManufacture,
            notes,
        } = req.body;

        const nameCount = await Weapon.count({
            where: {
                name: { [Op.eq]: name }
            }
        });
        if (nameCount > 0) {
            errors['name'] = {
                message: 'The name already exists.',
                rule: 'unique'
            };
        }

        if (Object.keys(errors).length > 0) {
            return response(res, errors, 'validation', 422);
        }

        const weapon = new Weapon();
        weapon.name = name;
        if (generation) {
            weapon.generation = generation;
        }
        if (type) {
            weapon.type = type;
        }
        if (description) {
            weapon.description = description;
        }
        if (accuracy) {
            weapon.accuracy = accuracy;
        }
        if (reloadTime) {
            weapon.reloadTime = reloadTime;
        }
        if (damage) {
            weapon.damage = damage;
        }
        if (fireRate) {
            weapon.fireRate = fireRate;
        }
        if (recoil) {
            weapon.recoil = recoil;
        }
        if (magazineCapacity) {
            weapon.magazineCapacity = magazineCapacity;
        }
        if (bulletType) {
            weapon.bulletType = bulletType;
        }
        if (bulletCount) {
            weapon.bulletCount = bulletCount;
        }
        if (grenadeType) {
            weapon.grenadeType = grenadeType;
        }
        if (grenadeCount) {
            weapon.grenadeCount = grenadeCount;
        }
        if (weight) {
            weapon.weight = weight;
        }
        if (length) {
            weapon.length = length;
        }
        if (height) {
            weapon.height = height;
        }
        if (width) {
            weapon.width = width;
        }
        if (manufacturer) {
            weapon.manufacturer = manufacturer;
        }
        if (countryOfOrigin) {
            weapon.countryOfOrigin = countryOfOrigin;
        }
        if (yearOfManufacture) {
            weapon.yearOfManufacture = yearOfManufacture;
        }
        if (notes) {
            weapon.notes = notes;
        }
        await weapon.save();

        return response(res, weapon, 'Weapon saved successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const show = async (req, res) => {
    try {
        const { id } = req.params;

        const weapon = await Weapon.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!weapon) {
            return response(res, weapon, 'Weapon not found.', 404);
        }

        return response(res, weapon, 'Weapon details.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const update = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            name: 'required'
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        let errors = {};
        const { id } = req.params;
        const {
            name,
            generation,
            type,
            description,
            accuracy,
            reloadTime,
            damage,
            fireRate,
            recoil,
            magazineCapacity,
            bulletType,
            bulletCount,
            grenadeType,
            grenadeCount,
            weight,
            length,
            height,
            width,
            manufacturer,
            countryOfOrigin,
            yearOfManufacture,
            notes,
        } = req.body;

        const nameCount = await Weapon.count({
            where: {
                [Op.and]: [
                    { name: { [Op.eq]: name } },
                    { id: { [Op.ne]: id } }
                ]
            }
        });
        if (nameCount > 0) {
            errors['name'] = {
                message: 'The name already exists.',
                rule: 'unique'
            };
        }

        if (Object.keys(errors).length > 0) {
            return response(res, errors, 'validation', 422);
        }

        const weapon = await Weapon.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!weapon) {
            return response(res, weapon, 'Weapon not found.', 404);
        }

        weapon.name = name;
        if (generation) {
            weapon.generation = generation;
        }
        if (type) {
            weapon.type = type;
        }
        if (description) {
            weapon.description = description;
        }
        if (accuracy) {
            weapon.accuracy = accuracy;
        }
        if (reloadTime) {
            weapon.reloadTime = reloadTime;
        }
        if (damage) {
            weapon.damage = damage;
        }
        if (fireRate) {
            weapon.fireRate = fireRate;
        }
        if (recoil) {
            weapon.recoil = recoil;
        }
        if (magazineCapacity) {
            weapon.magazineCapacity = magazineCapacity;
        }
        if (bulletType) {
            weapon.bulletType = bulletType;
        }
        if (bulletCount) {
            weapon.bulletCount = bulletCount;
        }
        if (grenadeType) {
            weapon.grenadeType = grenadeType;
        }
        if (grenadeCount) {
            weapon.grenadeCount = grenadeCount;
        }
        if (weight) {
            weapon.weight = weight;
        }
        if (length) {
            weapon.length = length;
        }
        if (height) {
            weapon.height = height;
        }
        if (width) {
            weapon.width = width;
        }
        if (manufacturer) {
            weapon.manufacturer = manufacturer;
        }
        if (countryOfOrigin) {
            weapon.countryOfOrigin = countryOfOrigin;
        }
        if (yearOfManufacture) {
            weapon.yearOfManufacture = yearOfManufacture;
        }
        if (notes) {
            weapon.notes = notes;
        }
        await weapon.save();

        return response(res, weapon, 'Weapon updated successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const weapon = await Weapon.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!weapon) {
            return response(res, weapon, 'Weapon not found.', 404);
        }

        await weapon.destroy();
        return response(res, weapon, 'Weapon deleted successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

module.exports = {
    index,
    store,
    show,
    update,
    destroy
};