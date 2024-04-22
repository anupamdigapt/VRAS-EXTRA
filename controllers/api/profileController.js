// Validator
const { Validator } = require('node-input-validator');

// Custom Helper
const { formatedDateTime, formatedDate, futureDate } = require('../../helpers/custom');

// Upload Helper
const { upload, thumbnail } = require('../../helpers/uploads');

// Common Response
const { response } = require('../../config/response');

// Model
const { Op } = require('sequelize');
const { User } = require('../../models/User');

const show = async (req, res) => {
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

        return response(res, user, 'User profile.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const update = async (req, res) => {
    try {
        upload(
            [{ name: 'avatar', maxCount: 1 }],
            ["image/jpeg", "image/jpg", "image/png"]
        )(req, res, async (err) => {
            if (err) {
                return response(res, req.body, err.message, 500);
            }

            const validator = new Validator(req.body, {
                name: 'sometimes',
                mobile: 'sometimes|digits:10',
                email: 'sometimes|email',
                username: 'sometimes',
                address: 'alpha'
            });
            const matched = await validator.check();
            if (!matched) {
                return response(res, validator.errors, 'validation', 422);
            }

            let errors = {};
            if (req.fileValidationError) {
                errors['avatar'] = {
                    message: req.fileValidationError,
                    rule: 'file'
                };
            }

            const { id } = req.user;
            const {
                name,
                lastName,
                mobile,
                email,
                username,
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
                allergies
            } = req.body;

            if (mobile) {
                const mobileCount = await User.count({
                    where: {
                        [Op.and]: [
                            { role: { [Op.ne]: 'admin' } },
                            { status: { [Op.eq]: 'active' } },
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

            if (email) {
                const emailCount = await User.count({
                    where: {
                        [Op.and]: [
                            { role: { [Op.ne]: 'admin' } },
                            { status: { [Op.eq]: 'active' } },
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

            if (username) {
                const usernameCount = await User.count({
                    where: {
                        [Op.and]: [
                            { role: { [Op.ne]: 'admin' } },
                            { status: { [Op.eq]: 'active' } },
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

            if (Object.keys(errors).length) {
                return response(res, errors, 'validation', 422);
            }

            const user = await User.findOne({
                where: {
                    [Op.and]: [
                        { role: { [Op.ne]: 'admin' } },
                        { status: { [Op.eq]: 'active' } },
                        { id: { [Op.eq]: id } }
                    ]
                }
            });
            if (!user) {
                return response(res, req.body, 'User not found.', 404);
            }

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
            if (req.files && Object.keys(req.files).length) {
                let avatar = req.files['avatar'][0];
                user.avatar = await thumbnail(avatar.path, avatar.destination, avatar.filename);
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
            await user.save();

            return response(res, user, 'Profile update successful.', 200);
        });
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

module.exports = {
    show,
    update
};