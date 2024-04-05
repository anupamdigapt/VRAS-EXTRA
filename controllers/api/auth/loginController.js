const { Validator } = require('node-input-validator');
const bcrypt = require('bcrypt');
const moment = require('moment');
const { Op } = require('sequelize');
const { User } = require('../../../models/User');
const { Client } = require('../../../models/Client');
const { response } = require('../../../config/response');
const cookie = require('cookie');
const randomstring = require('randomstring');

const { generateCode } = require('../../../config/auth');

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

        const { username, password } = req.body;

        // Attempt to find the user
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

        if (!user) {
            return response(res, { message: 'User not found.' }, 'User not found.', 404);
        }

        // Check client subscription status
        if (user.client) {
            const fromDate = moment().startOf('day');
            const toDate = moment(user.client.endAt).startOf('day');
            if (user.client.endAt && toDate.isSameOrBefore(fromDate)) {
                return response(res, { message: 'Subscription expired. Please renew.' }, 'Subscription expired. Please renew.', 403);
            }

            if (user.client.status !== 'active') {
                return response(res, { message: 'Client inactive. Contact Super-Admin.' }, 'Client inactive. Contact Super-Admin.', 403);
            }
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return response(res, { message: 'Invalid credentials.' }, 'Invalid credentials.', 401);
        }

        // Generate token and code
        const token = randomstring.generate({
            length: 32,
            charset: 'alphanumeric',
        });
        const code = generateCode();
        user.token = token;
        user.code = code;

        // Save user
        await user.save();

        // Set token in response header
        res.setHeader('Authorization', token);

        return response(res, user, 'User login successful.', 200);
    } catch (error) {
        console.error('Login error:', error);
        return response(res, req.body, 'Internal Server Error', 500);
    }
}

module.exports = {
    login,
};
