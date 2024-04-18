// Validator 
const { Validator } = require('node-input-validator');

// Common Response
const { response } = require('../../config/response');

// Model
const { Op } = require('sequelize');
const { Target } = require('../../models/Target');

const index = async (req,res) => {
    try {
        let {
            page,
            length
        } = req.query;
        page = page > 0 ? parseInt(page) : 1;
        length = length > 0 ? parseInt(length) : 10;
        let offset = (page -1) * length;

        const { clientId } = req.user
        
        const { count: total, rows: targets } = await Target.findAndCountAll({
            where: {
                clientId: { [Op.eq]: clientId }
            },
            order: [
                ['id', 'ASC']
            ],
            limit: length,
            offset: offset
        })

        return response(res, { targets, total }, 'Targets list.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const store = async (req, res) =>{
    try {
        const validator = new Validator(req.body, {
            targetType: 'required',
            name: 'required',
            description: 'required'
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        const { clientId } = req.user;
        const {
            targetType,
            name,
            description,
            location,
            latitude,
            longitude,
            heightAboveGround,
            difficulty,
            health,
            size,
            behavior,
            weaknesses,
            armament,
            armor,
            vulnerability,
            movementPattern,
            visualAppearance,
            soundAppearance,
            threatLevel,
            notes
        } = req.body;

        const target = new Target();
        target.clientId = clientId;
        target.targetType = targetType;
        target.name = name;
        target.description = description;
        if (location) {
            target.location = location;
        }
        if (latitude) {
            target.latitude = latitude;
        }
        if (longitude) {
            target.longitude = longitude;
        }
        if (heightAboveGround) {
            target.heightAboveGround = heightAboveGround;
        }
        if (difficulty) {
            target.difficulty = difficulty;
        }
        if (health) {
            target.health = health;
        }
        if (size) {
            target.size = size;
        }
        if (behavior) {
            target.behavior = behavior;
        }
        if (weaknesses) {
            target.weaknesses = weaknesses;
        }
        if (armament) {
            target.armament = armament;
        }
        if (armor) {
            target.armor = armor;
        }
        if (vulnerability) {
            target.vulnerability = vulnerability;
        }
        if (movementPattern) {
            target.movementPattern = movementPattern;
        }
        if (visualAppearance) {
            target.visualAppearance = visualAppearance;
        }
        if (soundAppearance) {
            target.soundAppearance = soundAppearance;
        }
        if (threatLevel) {
            target.threatLevel = threatLevel;
        }
        if (notes) {
            target.notes = notes;
        }
        await target.save();

        return response(res, target, 'Target Saved Sucessfully.', 200)
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const show = async (req, res) => {
    try {
        const { id } = req.params;

        const { clientId } = req.user;

        const target = await Target.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!target) {
            return response(res, target, 'Target not found.')
        }

        return response(res, target, 'Target found Successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const update = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            targetType: 'required',
            name: 'required',
            description: 'required'
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        const { id } = req.params;
        const { clientId } = req.user;
        const {
            targetType,
            name,
            description,
            location,
            latitude,
            longitude,
            heightAboveGround,
            difficulty,
            health,
            size,
            behavior,
            weaknesses,
            armament,
            armor,
            vulnerability,
            movementPattern,
            visualAppearance,
            soundAppearance,
            threatLevel,
            notes
        } = req.body;

        const target = await Target.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!target) {
            return response(res, target, 'Target not found.', 404);
        }

        // target.clientId = clientId;
        target.targetType = targetType;
        target.name = name;
        target.description = description;
        if (location) {
            target.location = location;
        }
        if (latitude) {
            target.latitude = latitude;
        }
        if (longitude) {
            target.longitude = longitude;
        }
        if (heightAboveGround) {
            target.heightAboveGround = heightAboveGround;
        }
        if (difficulty) {
            target.difficulty = difficulty;
        }
        if (health) {
            target.health = health;
        }
        if (size) {
            target.size = size;
        }
        if (behavior) {
            target.behavior = behavior;
        }
        if (weaknesses) {
            target.weaknesses = weaknesses;
        }
        if (armament) {
            target.armament = armament;
        }
        if (armor) {
            target.armor = armor;
        }
        if (vulnerability) {
            target.vulnerability = vulnerability;
        }
        if (movementPattern) {
            target.movementPattern = movementPattern;
        }
        if (visualAppearance) {
            target.visualAppearance = visualAppearance;
        }
        if (soundAppearance) {
            target.soundAppearance = soundAppearance;
        }
        if (threatLevel) {
            target.threatLevel = threatLevel;
        }
        if (notes) {
            target.notes = notes;
        }
        await target.save();

        return response(res, target, 'Target updated successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const target = await Target.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!target) {
            return response(res, target, 'Target not found.', 404);
        }

        await target.destroy();

        return response(res, target, 'Target deleted successfully.', 200);
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
}