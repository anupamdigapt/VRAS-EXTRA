// Validator
const { Validator } = require('node-input-validator');

// Custom Helper
const { formatedDateTime, formatedDate, futureDate } = require('../../helpers/custom');

// Common Response
const { response } = require('../../config/response');

// Model
const { Op } = require('sequelize');
const { Session } = require('../../models/Session');

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

        const { count: total, rows: sessions } = await Session.findAndCountAll({
            where: {
                clientId: { [Op.eq]: clientId }
            },
            order: [
                ['id', 'ASC']
            ],
            limit: length,
            offset: offset
        })

        return response(res, { sessions, total }, 'Sessions list.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const store = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            userId: 'required',
            sessionType: 'required',
            name: 'required',
            startAt: 'required',
            endAt: 'required'
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        const { clientId } = req.user;
        const {
            userId,
            sessionType,
            name,
            startAt,
            endAt,
            outcome,
            score,
            timeOfDay,
            location,
            participants,
            notes,
            sessionRecording
        } = req.body;

        const session = new Session()
        session.clientId = clientId;
        session.userId = userId;
        session.sessionType = sessionType;
        session.name = name;
        session.startAt = formatedDateTime(startAt);
        session.endAt = formatedDateTime(endAt);
        if (outcome) {
            session.outcome = outcome;
        }
        if (score) {
            session.score = score;
        }
        if (timeOfDay) {
            session.timeOfDay = timeOfDay;
        }
        if (location) {
            session.location = location;
        }
        if (participants) {
            session.participants = participants;
        }
        if (notes) {
            session.notes = notes;
        }
        if (sessionRecording) {
            session.sessionRecording = sessionRecording;
        }
        await session.save();

        return response(res, session, 'Session saved successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const show = async (req, res) => {
    try {
        const { id } = req.params;

        const { clientId } = req.user;

        const session = await Session.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!session) {
            return response(res, session, 'Session not found.', 404);
        }

        return response(res, session, 'Session details.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const update = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            userId: 'required',
            sessionType: 'required',
            name: 'required',
            startAt: 'required',
            endAt: 'required'
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        const { id } = req.params;
        const { clientId } = req.user;
        const {
            userId,
            sessionType,
            name,
            startAt,
            endAt,
            outcome,
            score,
            timeOfDay,
            location,
            participants,
            notes,
            sessionRecording
        } = req.body;

        const session = await Session.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!session) {
            return response(res, session, 'Session not found.', 404);
        }

        // session.clientId = clientId;
        session.userId = userId;
        session.sessionType = sessionType;
        session.name = name;
        session.startAt = formatedDateTime(startAt);
        session.endAt = formatedDateTime(endAt);
        if (outcome) {
            session.outcome = outcome;
        }
        if (score) {
            session.score = score;
        }
        if (timeOfDay) {
            session.timeOfDay = timeOfDay;
        }
        if (location) {
            session.location = location;
        }
        if (participants) {
            session.participants = participants;
        }
        if (notes) {
            session.notes = notes;
        }
        if (sessionRecording) {
            session.sessionRecording = sessionRecording;
        }
        await session.save();

        return response(res, session, 'Session updated successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const session = await Session.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!session) {
            return response(res, session, 'Session not found.', 404);
        }

        await session.destroy();

        return response(res, session, 'Session deleted successfully.', 200);
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