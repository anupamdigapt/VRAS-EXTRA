// Validator
const { Validator } = require('node-input-validator');

// Bcrypt for hash password
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10); // generate a salt

// Custom Helper
const { formatedDateTime, formatedDate, futureDate } = require('../../../helpers/custom');

// Common Response
const { response } = require('../../../config/response');

// Mailer
const { transporter, emailTemplatePath, mailOption } = require('../../../config/mailer');
const ejs = require('ejs');

// Model
const { Op } = require('sequelize');
const { Client } = require('../../../models/Client');
const { Subscription } = require('../../../models/Subscription');
const { User } = require('../../../models/User');

const index = async (req, res) => {
    try {
        let {
            page,
            length
        } = req.query;
        page = page > 0 ? parseInt(page) : 1;
        length  = length > 0 ? parseInt(length) : 10;
        let offset = (page - 1) * length;

        const { count: total, rows: clients } = await Client.findAndCountAll({
            include: [Subscription, User],
            order: [
                ['name', 'ASC']
            ],
            limit: length,
            offset: offset
        });

        return response(res, { clients, total }, 'Clients list.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const store = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            subscriptionId: 'required',
            numberOfUsers: 'required|numeric',
            slug: 'required',
            name: 'required',
            mobile: 'required|digits:10',
            email: 'required|email',
            username: 'required',
            password: 'required|same:confirmPassword',
            confirmPassword: 'required|same:password'
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        let errors = {};
        const {
            subscriptionId,
            numberOfUsers,
            slug,
            name,
            mobile,
            email,
            username,
            password,
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
            startAt,
        } = req.body;

        const slugCount = await Client.count({
            where: {
                slug: { [Op.eq]: slug }
            }
        });
        if (slugCount > 0) {
            errors['slug'] = {
                message: 'The slug already exists.',
                rule: 'unique'
            };
        }

        const nameCount = await Client.count({
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

        const usernameCount = await User.count({
            where: {
                [Op.and]: [
                    { role: { [Op.ne]: 'admin' } },
                    { status: { [Op.eq]: 'active' } },
                    { username: { [Op.eq]: username } }
                ]
            }
        });
        if (usernameCount > 0) {
            errors['username'] = {
                message: 'The username already exists.',
                rule: 'unique'
            };
        }

        const emailCount = await Client.count({
            where: {
                email: { [Op.eq]: email }
            }
        });
        const userEmailCount = await User.count({
            where: {
                [Op.and]: [
                    { role: { [Op.ne]: 'admin' } },
                    { status: { [Op.eq]: 'active' } },
                    { email: { [Op.eq]: email } }
                ]
            }
        });
        if (emailCount > 0 || userEmailCount > 0) {
            errors['email'] = {
                message: 'The email already exists.',
                rule: 'unique'
            };
        }

        const mobileCount = await Client.count({
            where: {
                mobile: { [Op.eq]: mobile }
            }
        });
        const userMobileCount = await User.count({
            where: {
                [Op.and]: [
                    { role: { [Op.ne]: 'admin' } },
                    { status: { [Op.eq]: 'active' } },
                    { mobile: { [Op.eq]: mobile } }
                ]
            }
        });
        if (mobileCount > 0 || userMobileCount > 0) {
            errors['mobile'] = {
                message: 'The mobile already exists.',
                rule: 'unique'
            };
        }

        if (Object.keys(errors).length > 0) {
            return response(res, errors, 'validation', 422);
        }

        const subscription = await Subscription.findOne({
            where: {
                id: { [Op.eq]: subscriptionId }
            }
        });

        const client = new Client();
        client.subscriptionId = subscriptionId;
        client.numberOfUsers = subscription?.numberOfUsers || numberOfUsers;
        client.slug = slug;
        client.name = name;
        client.email = email;
        client.mobile = mobile;
        if (address) {
            client.address = address;
        }
        if (city) {
            client.city = city;
        }
        if (country) {
            client.country = country;
        }
        if (postalCode) {
            client.postalCode = postalCode;
        }
        if (startAt) {
            client.startAt = formatedDate(startAt);
            client.endAt = futureDate(startAt, subscription?.numberOfDays || 1);
        }
        client.payStatus = 'initiate';
        client.status = 'inactive';
        await client.save();

        const user = new User();
        if (client?.id) {
            user.clientId = client?.id;
        }
        user.name = name;
        user.mobile = mobile;
        user.email = email;
        user.username = username;
        user.password = bcrypt.hashSync(password, salt); // generate a hash
        user.role = 'client';
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
        user.status = 'inactive';
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

        return response(res, client, 'Client saved successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const show = async (req, res) => {
    try {
        const { id } = req.params;

        const client = await Client.findOne({
            include: [Subscription, User],
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!client) {
            return response(res, client, 'Client not found.', 404);
        }

        return response(res, client, 'Client details.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const update = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            subscriptionId: 'required',
            numberOfUsers: 'required|numeric',
            name: 'required',
            email: 'required|email',
            mobile: 'required'
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        let errors = {};
        const { id } = req.params;
        const {
            subscriptionId,
            numberOfUsers,
            name,
            email,
            mobile,
            address,
            city,
            country,
            postalCode,
            startAt,
            endAt,
            payStatus,
            status
        } = req.body;

        const nameCount = await Client.count({
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

        const emailCount = await Client.count({
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

        const mobileCount = await Client.count({
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

        if (Object.keys(errors).length > 0) {
            return response(res, errors, 'validation', 422);
        }

        const client = await Client.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!client) {
            return response(res, client, 'Client not found.', 404);
        }

        client.subscriptionId = subscriptionId;
        client.numberOfUsers = numberOfUsers;
        client.name = name;
        client.email = email;
        client.mobile = mobile;
        if (address) {
            client.address = address;
        }
        if (city) {
            client.city = city;
        }
        if (country) {
            client.country = country;
        }
        if (postalCode) {
            client.postalCode = postalCode;
        }
        if (startAt) {
            client.startAt = startAt;
        }
        if (endAt) {
            client.endAt = endAt;
        }
        if (payStatus) {
            client.payStatus = payStatus;
        }
        if (status) {
            client.status = status;
        }
        await client.save();

        return response(res, client, 'Client updated successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const client = await Client.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!client) {
            return response(res, client, 'Client not found.', 404);
        }

        await client.destroy();

        return response(res, client, 'Client deleted successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const changeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            status,
            startAt
        } = req.body;

        const client = await Client.findOne({
            include: [Subscription],
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!client) {
            return response(res, client, 'Client not found.', 404);
        }

        client.status = status;
        client.payStatus = status == 'active' ? 'paid' : 'due';
        if (status == 'active') {
            client.startAt = formatedDate(startAt);
            client.endAt = futureDate(startAt, client?.subscription?.numberOfDays || 1);
        }
        await client.save();

        let userObjToUpdate = {};
        userObjToUpdate['status'] = status == 'active' ? 'active' : 'inactive';
        const [numRowsUpdated, updatedUsers] = await User.update(userObjToUpdate, {
            where: {
                clientId: client?.id || id
            }
        });

        return response(res, client, `Client ${status} successful.`, 200);
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
    changeStatus
};