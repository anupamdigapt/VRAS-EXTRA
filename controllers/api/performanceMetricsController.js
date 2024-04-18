// Validator
const { Validator } = require('node-input-validator');

// Export with Sheets
const Excel = require('exceljs');

// Custom helper
const { uniqueFileName } = require('../../helpers/custom');

// Common Response
const { response } = require('../../config/response');

// Model
const { Op } = require('sequelize');
const { Client } = require('../../models/Client');
const { Scenario } = require('../../models/Scenario');
const { Session } = require('../../models/Session');
const { User } = require('../../models/User');
const { PerformanceMetric } = require('../../models/PerformanceMetric');

const index = async (req, res) => {
    try {
        let {
            page,
            length,
            userId
        } = req.query;
        page = page > 0 ? parseInt(page) : 1;
        length = length > 0 ? parseInt(length) : 10;
        let offset = (page - 1) * length;

        const { clientId } = req.user;

        let whereCondition = {
            clientId: { [Op.eq]: clientId }
        };
        if (userId) {
            whereCondition.userId = { [Op.eq]: userId };
        }

        const { count: total, rows: performanceMetrics } = await PerformanceMetric.findAndCountAll({
            include: [Client, Scenario, Session, User],
            where: whereCondition,
            order: [
                ['id', 'DESC']
            ],
            limit: length,
            offset: offset
        });

        return response(res, { performanceMetrics, total }, 'PerformanceMetrics list.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
};

const store = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            scenarioId: 'required|numeric',
            sessionId: 'required|numeric',
            userId: 'required|numeric',
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        const { clientId } = req.user;
        const {
            scenarioId,
            sessionId,
            userId,
            targetsHit,
            shotsFired,
            shotsHit,
            headshots,
            kills,
            neutralised,
            deaths,
            damageCaused,
            damageTaken,
            friendlyDamage,
            timeSurvived,
            pointsEarned,
            challengesCompleted,
            medalsEarned,
            achivementsUnlocked,
            xpLevel,
            xpProgress
        } = req.body;

        const performanceMetric = new PerformanceMetric();
        performanceMetric.clientId = clientId;
        performanceMetric.scenarioId = scenarioId;
        performanceMetric.sessionId = sessionId;
        performanceMetric.userId = userId;
        if (targetsHit) {
            performanceMetric.targetsHit = targetsHit;
        }
        if (shotsFired) {
            performanceMetric.shotsFired = shotsFired;
        }
        if (shotsHit) {
            performanceMetric.shotsHit = shotsHit;
        }
        if (headshots) {
            performanceMetric.headshots = headshots;
        }
        if (kills) {
            performanceMetric.kills = kills;
        }
        if (neutralised) {
            performanceMetric.neutralised = neutralised;
        }
        if (deaths) {
            performanceMetric.deaths = deaths;
        }
        if (damageCaused) {
            performanceMetric.damageCaused = damageCaused;
        }
        if (damageTaken) {
            performanceMetric.damageTaken = damageTaken;
        }
        if (friendlyDamage) {
            performanceMetric.friendlyDamage = friendlyDamage;
        }
        if (timeSurvived) {
            performanceMetric.timeSurvived = timeSurvived;
        }
        if (pointsEarned) {
            performanceMetric.pointsEarned = pointsEarned;
        }
        if (challengesCompleted) {
            performanceMetric.challengesCompleted = challengesCompleted;
        }
        if (medalsEarned) {
            performanceMetric.medalsEarned = medalsEarned;
        }
        if (achivementsUnlocked) {
            performanceMetric.achivementsUnlocked = achivementsUnlocked;
        }
        if (xpLevel) {
            performanceMetric.xpLevel = xpLevel;
        }
        if (xpProgress) {
            performanceMetric.xpProgress = xpProgress;
        }
        await performanceMetric.save();

        return response (res, performanceMetric, 'PerformanceMetric created successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const show = async (req, res) => {
    try {
        const { id } = req.params;

        const { clientId } = req.user;

        const performanceMetric = await PerformanceMetric.findOne({
            include: [Client, Scenario, Session, User],
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!performanceMetric) {
            return response(res, performanceMetric, 'PerformanceMetric not found.', 404);
        }

        return response(res, performanceMetric, 'PerformanceMetric details.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const update = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            clientId: 'required|numeric',
            scenarioId: 'required|numeric',
            sessionId: 'required|numeric',
            userId: 'required|numeric',
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        const { id } = req.params;
        const { clientId } = req.user;
        const {
            scenarioId,
            sessionId,
            userId,
            targetsHit,
            shotsFired,
            shotsHit,
            headshots,
            kills,
            neutralised,
            deaths,
            damageCaused,
            damageTaken,
            friendlyDamage,
            timeSurvived,
            pointsEarned,
            challengesCompleted,
            medalsEarned,
            achivementsUnlocked,
            xpLevel,
            xpProgress
        } = req.body;

        const performanceMetric = await PerformanceMetric.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!performanceMetric) {
            return response(res, performanceMetric, 'PerformanceMetric not found.', 404);
        }

        // performanceMetric.clientId = clientId;
        performanceMetric.scenarioId = scenarioId;
        performanceMetric.sessionId = sessionId;
        performanceMetric.userId = userId;
        if (targetsHit) {
            performanceMetric.targetsHit = targetsHit;
        }
        if (shotsFired) {
            performanceMetric.shotsFired = shotsFired;
        }
        if (shotsHit) {
            performanceMetric.shotsHit = shotsHit;
        }
        if (headshots) {
            performanceMetric.headshots = headshots;
        }
        if (kills) {
            performanceMetric.kills = kills;
        }
        if (neutralised) {
            performanceMetric.neutralised = neutralised;
        }
        if (deaths) {
            performanceMetric.deaths = deaths;
        }
        if (damageCaused) {
            performanceMetric.damageCaused = damageCaused;
        }
        if (damageTaken) {
            performanceMetric.damageTaken = damageTaken;
        }
        if (friendlyDamage) {
            performanceMetric.friendlyDamage = friendlyDamage;
        }
        if (timeSurvived) {
            performanceMetric.timeSurvived = timeSurvived;
        }
        if (pointsEarned) {
            performanceMetric.pointsEarned = pointsEarned;
        }
        if (challengesCompleted) {
            performanceMetric.challengesCompleted = challengesCompleted;
        }
        if (medalsEarned) {
            performanceMetric.medalsEarned = medalsEarned;
        }
        if (achivementsUnlocked) {
            performanceMetric.achivementsUnlocked = achivementsUnlocked;
        }
        if (xpLevel) {
            performanceMetric.xpLevel = xpLevel;
        }
        if (xpProgress) {
            performanceMetric.xpProgress = xpProgress;
        }
        await performanceMetric.save();

        return response(res, performanceMetric, 'PerformanceMetric updated successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const performanceMetric = await PerformanceMetric.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!performanceMetric) {
            return response(res, performanceMetric, 'PerformanceMetric not found.', 404);
        }

        await performanceMetric.destroy();

        return response(res, performanceMetric, 'PerformanceMetric deleted successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const exportSheets = async (req, res) => {
    try {
        const { userId } = req.params;
        const { clientId } = req.user;

        let whereCondition = {
            clientId: { [Op.eq]: clientId }
        };
        if (userId) {
            whereCondition.userId = { [Op.eq]: userId };
        }

        const performanceMetrics = await PerformanceMetric.findAll({
            include: [Client, Scenario, Session, User],
            where: whereCondition,
            order: [
                ['id', 'ASC']
            ]
        });
        if (!performanceMetrics) {
            return response(res, performanceMetrics, 'PerformanceMetric not found.', 404);
        }

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');
        worksheet.columns = [
            { header: 'clientId', key: 'clientId', width: 10 },
            { header: 'scenarioId', key: 'scenarioId', width: 10 },
            { header: 'sessionId', key: 'sessionId', width: 10 },
            { header: 'userId', key: 'userId', width: 10 },
            { header: 'targetsHit', key: 'targetsHit', width: 10 },
            { header: 'shotsFired', key: 'shotsFired', width: 10 },
            { header: 'shotsHit', key: 'shotsHit', width: 10 },
            { header: 'headshots', key: 'headshots', width: 10 },
            { header: 'kills', key: 'kills', width: 10 },
            { header: 'neutralised', key: 'neutralised', width: 10 },
            { header: 'deaths', key: 'deaths', width: 10 },
            { header: 'damageCaused', key: 'damageCaused', width: 10 },
            { header: 'damageTaken', key: 'damageTaken', width: 10 },
            { header: 'friendlyDamage', key: 'friendlyDamage', width: 10 },
            { header: 'timeSurvived', key: 'timeSurvived', width: 10 },
            { header: 'pointsEarned', key: 'pointsEarned', width: 10 },
            { header: 'challengesCompleted', key: 'challengesCompleted', width: 10 },
            { header: 'medalsEarned', key: 'medalsEarned', width: 10 },
            { header: 'achivementsUnlocked', key: 'achivementsUnlocked', width: 10 },
            { header: 'xpLevel', key: 'xpLevel', width: 10 },
            { header: 'xpProgress', key: 'xpProgress', width: 10 },
        ];

        if (performanceMetrics.length) {
            for (const row of performanceMetrics) {
                worksheet.addRow({
                    clientId: row.clientId,
                    scenarioId: row.scenarioId,
                    sessionId: row.sessionId,
                    userId: row.userId,
                    targetsHit: row.targetsHit,
                    shotsFired: row.shotsFired,
                    shotsHit: row.shotsHit,
                    headshots: row.headshots,
                    kills: row.kills,
                    neutralised: row.neutralised,
                    deaths: row.deaths,
                    damageCaused: row.damageCaused,
                    damageTaken: row.damageTaken,
                    friendlyDamage: row.friendlyDamage,
                    timeSurvived: row.timeSurvived,
                    pointsEarned: row.pointsEarned,
                    challengesCompleted: row.challengesCompleted,
                    medalsEarned: row.medalsEarned,
                    achivementsUnlocked: row.achivementsUnlocked,
                    xpLevel: row.xpLevel,
                    xpProgress: row.xpProgress,
                });
            }
        }

        // const buffer = await workbook.xlsx.writeBuffer();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${uniqueFileName('performanceMetrics')}.xlsx`);
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

module.exports = {
    index,
    store,
    show,
    update,
    destroy,
    exportSheets
};