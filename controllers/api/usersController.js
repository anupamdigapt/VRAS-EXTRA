// Validator
const { Validator } = require('node-input-validator');

// Bcrypt for hash password
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10); // generate a salt

// Custom Helper
const { formatedDateTime, formatedDate, futureDate } = require('../../helpers/custom');

// Common Response
const { response } = require('../../config/response');

// Mailer
const { transporter, emailTemplatePath, mailOption } = require('../../config/mailer');
const ejs = require('ejs');

// Model
const { Op } = require('sequelize');
const { Client } = require('../../models/Client');
const { User } = require('../../models/User');

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

        const { count: total, rows: users } = await User.findAndCountAll({
            include: [Client],
            where: {
                clientId: { [Op.eq]: clientId }
            },
            order: [
                ['name', 'ASC']
            ],
            limit: length,
            offset: offset
        });

        return response(res, { users, total }, 'Users list.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const store = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            name: 'required',
            mobile: 'required|digits:10',
            email: 'required|email',
            username: 'required',
            password: 'required|same:confirmPassword',
            confirmPassword: 'required|same:password',
            permissions: 'sometimes|json'
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        let errors = {};
        const { clientId } = req.user;
        const {
            name,
            lastName,
            mobile,
            email,
            username,
            password,
            permissions,
            dateOfBirth,
            gender,
            primaryHand,
            address,
            city,
            country,
            postalCode,
            emergencyContactName,
            emergencyContactPhone,
            medicalConditions,
            allergies,
            notes,
            experienceLevel,
            stressLevel
        } = req.body;

        const usernameCount = await User.count({
            where: {
                username: { [Op.eq]: username }
            }
        });
        if (usernameCount > 0) {
            errors['username'] = {
                message: 'The username already exists.',
                rule: 'unique'
            }
        }

        const emailCount = await User.count({
            where: {
                email: { [Op.eq]: email }
            }
        });
        if (emailCount > 0) {
            errors['email'] = {
                message: 'The email already exists.',
                rule: 'unique'
            }
        }

        const mobileCount = await User.count({
            where: {
                mobile: { [Op.eq]: mobile }
            }
        });
        if (mobileCount > 0) {
            errors['mobile'] = {
                message: 'The mobile already exists.',
                rule: 'unique'
            }
        }

        if (Object.keys(errors).length > 0) {
            return response(res, errors, 'validation', 422);
        }

        const user = new User();
        user.clientId = clientId;
        user.name = name;
        if (lastName) {
            user.lastName = lastName;
        }
        user.mobile = mobile;
        user.email = email;
        user.username = username;
        user.password = bcrypt.hashSync(password, salt); // generate a hash
        if (permissions) {
            user.permissions = permissions;
        }
        if (dateOfBirth) {
            user.dateOfBirth = formatedDate(dateOfBirth);
        }
        if (gender) {
            user.gender = gender;
        }
        if (primaryHand) {
            user.primaryHand = primaryHand;
        }
        if (address) {
            user.address = address;
        }
        if (city) {
            user.city = city;
        }
        if (country) {
            user.country = country;
        }
        if (postalCode) {
            user.postalCode = postalCode;
        }
        if (emergencyContactName) {
            user.emergencyContactName = emergencyContactName;
        }
        if (emergencyContactPhone) {
            user.emergencyContactPhone = emergencyContactPhone;
        }
        if (medicalConditions) {
            user.medicalConditions = medicalConditions;
        }
        if (allergies) {
            user.allergies = allergies;
        }
        if (notes) {
            user.notes = notes;
        }
        if (experienceLevel) {
            user.experienceLevel = experienceLevel;
        }
        if (stressLevel) {
            user.stressLevel = stressLevel;
        }
        await user.save();

        // Mail
        const subject = 'Registration Successful.';
        const content = `<div>
            <p>Congratulations! your profile has been registered successfully.</p>
            <p>Username: ${user?.username}</p>
            <p>Password: ${password}</p>
            <p>You can also use your registered email & mobile as username.</p>
        </div>`;
        const emailContent = await ejs.renderFile(emailTemplatePath, {
            user: user?.name,
            title: subject,
            content: content
        });
        const mailOptions = {
            ...mailOption,
            to: user?.email,
            subject: subject,
            html: emailContent
        };
        await transporter.sendMail(mailOptions);

        return response(res, user, 'User created successfully.');
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const show = async (req, res) => {
    try {
        const { id } = req.params;

        const { clientId } = req.user;

        const user = await User.findOne({
            include: [Client],
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!user) {
            return response(res, user, 'User not found.', 404);
        }

        return response(res, user, 'User details.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const update = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            name: 'sometimes',
            mobile: 'sometimes|digits:10',
            email: 'sometimes|email',
            username: 'sometimes',
            password: 'same:confirmPassword',
            confirmPassword: 'same:password',
            permissions: 'sometimes|json'
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'Validation', 422);
        }

        let errors = {};
        const { id } = req.params;
        const { clientId } = req.user;
        const {
            name,
            lastName,
            mobile,
            email,
            username,
            password,
            permissions,
            dateOfBirth,
            gender,
            primaryHand,
            address,
            city,
            country,
            postalCode,
            emergencyContactName,
            emergencyContactPhone,
            medicalConditions,
            allergies,
            notes,
            experienceLevel,
            stressLevel
        } = req.body;

        if (username) {
            const usernameCount = await User.count({
                where: {
                    [Op.and]: [
                        { username: { [Op.eq]: username } },
                        { id: { [Op.ne]: id } }
                    ]
                }
            });
            if (usernameCount > 0) {
                errors['username'] = {
                    message: 'The username already exists.',
                    rule: 'unique'
                };
            }
        }

        if (email) {
            const emailCount = await User.count({
                where: {
                    [Op.and]: [
                        { email: { [Op.eq]: email } },
                        { id: { [Op.ne]: id } }
                    ]
                }
            });
            if (emailCount > 0) {
                errors['email'] = {
                    message: 'The email already exists.',
                    rule: 'unique'
                };
            }
        }

        if (mobile) {
            const mobileCount = await User.count({
                where: {
                    [Op.and]: [
                        { mobile: { [Op.eq]: mobile } },
                        { id: { [Op.ne]: id } }
                    ]
                }
            });
            if (mobileCount > 0) {
                errors['mobile'] = {
                    message: 'The mobile already exists.',
                    rule: 'unique'
                };
            }
        }

        if (Object.keys(errors).length > 0) {
            return response(res, errors, 'validation', 422);
        }

        const user = await User.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!user) {
            return response(res, user, 'User not found.', 404);
        }

        // user.clientId = clientId;
        if (name) {
            user.name = name;
        }
        if (lastName) {
            user.lastName = lastName;
        }
        if (mobile) {
            user.mobile = mobile;
        }
        if (email) {
            user.email = email;
        }
        if (username) {
            user.username = username;
        }
        if (password) {
            user.password = bcrypt.hashSync(password, salt); // generate a hash
        }
        if (permissions) {
            user.permissions = permissions;
        }
        if (dateOfBirth) {
            user.dateOfBirth = formatedDate(dateOfBirth);
        }
        if (gender) {
            user.gender = gender;
        }
        if (primaryHand) {
            user.primaryHand = primaryHand;
        }
        if (address) {
            user.address = address;
        }
        if (city) {
            user.city = city;
        }
        if (country) {
            user.country = country;
        }
        if (postalCode) {
            user.postalCode = postalCode;
        }
        if (emergencyContactName) {
            user.emergencyContactName = emergencyContactName;
        }
        if (emergencyContactPhone) {
            user.emergencyContactPhone = emergencyContactPhone;
        }
        if (medicalConditions) {
            user.medicalConditions = medicalConditions;
        }
        if (allergies) {
            user.allergies = allergies;
        }
        if (notes) {
            user.notes = notes;
        }
        if (experienceLevel) {
            user.experienceLevel = experienceLevel;
        }
        if (stressLevel) {
            user.stressLevel = stressLevel;
        }
        await user.save();

        return response(res, user, 'User updated successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!user) {
            return response(res, user, 'User not found.', 404);
        }

        await user.destroy();

        return response(res, user, 'User deleted successfully.', 200);
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