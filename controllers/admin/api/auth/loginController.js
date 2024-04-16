// Validator
const { Validator } = require('node-input-validator');

// Bcrypt for Hash Password
const bcrypt = require('bcrypt');
const salt = bcrypt.genSalt(10);

// Common Response
const { response } = require('../../../../config/response');

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
const { User } = require('../../../../models/User');


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
            where: {
                [Op.and]: [
                    { role: { [Op.eq]: 'admin' } },
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

        return response(res, user, 'Admin login successfull.', 200);
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
            return response(res, req.body, 'Admin not found.', 404);
        }

        // Add the token to the blacklist
        blacklistedTokens.add(user.token);

        user.token = null;
        await user.save();

        return response(res, user, 'Admin logout successfull.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

module.exports = {
    login,
    logout
};