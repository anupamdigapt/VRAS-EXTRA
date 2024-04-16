// Validator
const { Validator } = require('node-input-validator');

// Bcrypt for hash password
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10); // generate a salt

const moment = require('moment');

// Common Response
const { response } = require('../../../config/response');

// Cookie handling library
const cookie = require('cookie');

// Unique Token
const randomString = require('randomstring');
const generateUniqueCode = randomString.generate({
    length: 30,
    charset: 'numeric'
});

// Model
const { Op } = require('sequelize');
const { User } = require('../../../models/User');
const { Client } = require('../../../models/Client');

const login = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            username: 'required',
            password: 'required'
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        let errors = {};
        const {
            username,
            password
        } = req.body;

        const user = await User.findOne({
            include: [Client],
            where: {
                [Op.and]: [
                    { role: { [Op.ne]: 'admin' } },
                    { status: { [Op.eq]: 'active' } },
                    {
                        [Op.or]: [
                            { username: { [Op.eq]: username } },
                            { email: { [Op.eq]: username } },
                            { mobile: { [Op.eq]: username } }
                        ],
                    }
                ]
            }
        });
        if (user?.client) {
            const fromDate = moment().startOf('day');
            const toDate = moment(user?.client?.endAt).startOf('day');
            if (user?.client?.endAt && toDate.isSameOrBefore(fromDate)) {
                errors['username'] = {
                    message: 'Subscription expired. Please renew.',
                    rule: 'same'
                };
            }

            if (user?.client?.status != 'active') {
                errors['username'] = {
                    message: 'Client inactive. Contact Super-Admin.',
                    rule: 'same'
                };
            }
        }
        if (!user || !(await bcrypt.compare(password, user?.password))) {
            errors['username'] = {
                message: 'Invalid credentials.',
                rule: 'same'
            };
        }

        if (Object.keys(errors).length) {
            return response(res, errors, 'validation', 422);
        }

        const token = generateUniqueCode; // Token to be set as cookie
        user.token = token;
        await user.save();
        
        res.setHeader('Set-Cookie', cookie.serialize('authToken', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'strict',
            path: '/'
        }));

        return response(res, user, 'User login successful.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const logout = async (req, res) => {
    try {
        const { id } = req.user;

        const user = await User.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!user) {
            return response(res, req.body, 'User not found.', 404);
        }

        // Add the token to the blacklist
        blacklistedTokens.add(user.token);

        user.token = null;
        user.code = null;
        await user.save();

        return response(res, user, 'User logout successfull.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const vrLogin = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            code: 'required'
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        const { code } = req.body;

        const user = await User.findOne({
            where: {
                [Op.and]: [
                    { role: { [Op.ne]: 'admin' } },
                    { status: { [Op.eq]: 'active' } },
                    { code: { [Op.eq]: code } }
                ]
            }
        });
        if (!user) {
            return response(res, user, 'User not found.', 404);
        }

        return response(res, user, 'User vrlogin successfull.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

module.exports = {
    login,
    logout,
    vrLogin
}
