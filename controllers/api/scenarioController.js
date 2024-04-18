// Validator
const { Validator } = require('node-input-validator');

// Common Response
const { response } = require('../../config/response');

// Model
const { Op } = require('sequelize');
const { Scenario } = require('../../models/Scenario');
const { Session } = require('../../models/Session')

const index = async (req, res) => {
    try {
        let {
            page,
            length
        } = req.query;
        page = page > 0 ? parseInt(page) : 1;
        length  = length > 0 ? parseInt(length) : 10;
        let offset = (page - 1) * length;

        const { clientId } = req.user;

        const { count: total, rows: scenarios } = await Scenario.findAndCountAll({
            where: {
                clientId: { [Op.eq]: clientId }
            },
            include: [ Session ],
            order: [
                ['id', 'ASC']
            ],
            limit: length,
            offset: offset
        });

        return response(res, { scenarios, total }, 'Scenarios list.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const store = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            sessionId: 'required',
            scenarioType: 'required',
            name: 'required'
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        const { clientId } = req.user;
        const {
            sessionId,
            scenarioType,
            name,
            environment,
            location,
            timeLimit,
            difficulty,
            objective,
            description,
            hazards,
            challenges,
            requiredSkills,
            rewards
        } = req.body;

        const scenario = new Scenario();
        scenario.clientId = clientId;
        scenario.sessionId = sessionId;
        scenario.scenarioType = scenarioType;
        scenario.name = name;
        if (environment) {
            scenario.environment = environment;
        }
        if (location) {
            scenario.location = location;
        }
        if (timeLimit) {
            scenario.timeLimit = timeLimit;
        }
        if (difficulty) {
            scenario.difficulty = difficulty;
        }
        if (objective) {
            scenario.objective = objective;
        }
        if (description) {
            scenario.description = description;
        }
        if (hazards) {
            scenario.hazards = hazards;
        }
        if (challenges) {
            scenario.challenges = challenges;
        }
        if (requiredSkills) {
            scenario.requiredSkills = requiredSkills;
        }
        if (rewards) {
            scenario.rewards = rewards;
        }
        await scenario.save();

        return response(res, scenario, 'Session saved sucessfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const show = async (req, res) => {
    try {
        const { id } = req.params;

        const { clientId } = req.user;

        const scenario = await Scenario.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!scenario) {
            return response(res, scenario, 'Scenario not found.', 404);
        }

        return response(res, scenario, 'Scenario found successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const update = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            sessionId: 'required',
            scenarioType: 'required',
            name: 'required'
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        const { id } = req.params;
        const { clientId } = req.user;
        const {
            sessionId,
            scenarioType,
            name,
            environment,
            location,
            timeLimit,
            difficulty,
            objective,
            description,
            hazards,
            challenges,
            requiredSkills,
            rewards
        } = req.body;

        const scenario = await Scenario.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!scenario) {
            return response(res, scenario, 'Scenario not found.', 404);
        }

        // scenario.clientId = clientId;
        scenario.sessionId = sessionId;
        scenario.scenarioType = scenarioType;
        scenario.name = name;
        if (environment) {
            scenario.environment = environment;
        }
        if (location) {
            scenario.location = location;
        }
        if (timeLimit) {
            scenario.timeLimit = timeLimit;
        }
        if (difficulty) {
            scenario.difficulty = difficulty;
        }
        if (objective) {
            scenario.objective = objective;
        }
        if (description) {
            scenario.description = description;
        }
        if (hazards) {
            scenario.hazards = hazards;
        }
        if (challenges) {
            scenario.challenges = challenges;
        }
        if (requiredSkills) {
            scenario.requiredSkills = requiredSkills;
        }
        if (rewards) {
            scenario.rewards = rewards;
        }
        await scenario.save();

        return response(res, scenario, 'Scenario updated successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const scenario = await Scenario.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!scenario) {
            return response(res, scenario, 'Scenario not found.', 404);
        }

        await scenario.destroy();

        return response(res, scenario, 'Scenario deleted successfully.', 200);
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