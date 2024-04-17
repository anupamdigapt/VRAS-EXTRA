// Validator
const { Validator } = require('node-input-validator');

// Common Response
const { response } = require('../../../config/response');

// Model
const { Op } = require('sequelize');
const { Subscription } = require('../../../models/Subscription');

const index = async (req,res) => {
    try {
        let {
            page,
            length
        } = req.query;
        page = page > 0 ? parseInt(page) : 1;
        length = length > 0 ? parseInt(length) : 10;
        let offset = (page -1) * length;

        const { count: total, rows: subscriptions } = await Subscription.findAndCountAll({
            order: [
                ['id', 'ASC']
            ],
            limit: length,
            offset: offset
        });

        return response(res, { subscriptions, total },'Subscription list.', 200)
    } catch (error) {
        return response(res, req.body, error.message, 500)
    }
}

const store = async (req,res) => {
    try {
        const validator = new Validator(req.body, {
            name: 'required',
            price: 'required',
            numberOfDays: 'required|numeric',
            numberOfUsers: 'required|numeric',
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors,'validation', 422);
        }

        let errors = {};
        const {
            name,
            price,
            numberOfDays,
            numberOfUsers,
            description
        } = req.body;

        const nameCount = await Subscription.count({
            where: {
                name: { [Op.eq]: name }
            }
        });
        if (nameCount > 0){
            errors['name'] = {
                message: 'The name is already exists.',
                rule: 'unique'
            };
        }

        if (Object.keys(errors).length) {
            return response(res, errors, 'validation', 422);
        }

        const subscription = new Subscription();
        subscription.name = name;
        subscription.price = price;
        subscription.numberOfDays = numberOfDays;
        subscription.numberOfUsers = numberOfUsers;
        if (description) {
            subscription.description = description;
        }
        await subscription.save();

        return response(res, subscription, 'Subscription saved sucessfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500)
    }
}

const show = async (req,res) =>{
    try {
        const { id } = req.params;

        const subscription = await Subscription.findOne({
            where: {
                id: { [Op.eq]: id}
            }
        });
        if (!subscription) {
            return response(res, subscription,'Subscription not found.', 404)
        }

        return response(res, subscription, 'Subscription details.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const update = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            name: 'required',
            price: 'required',
            numberOfDays: 'required|numeric',
            numberOfUsers: 'required|numeric',
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'Validation', 422);
        }

        let errors = {};
        const { id } = req.params;
        const {
            name,
            price,
            numberOfDays,
            numberOfUsers,
            description
        } = req.body;

        const nameCount = await Subscription.count({
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

        if (Object.keys(errors).length) {
            return response(res, errors, 'validation', 422);
        }

        const subscription = await Subscription.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!subscription) {
            return response(res, subscription, 'Subscription not found.', 404);
        }

        subscription.name = name;
        subscription.price = price;
        subscription.numberOfDays = numberOfDays;
        subscription.numberOfUsers = numberOfUsers;
        if (description) {
            subscription.description = description;
        }
        await subscription.save();

        return response(res, subscription, 'Subscription updated successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const subscription = await Subscription.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!subscription) {
            return response(res, subscription, 'Subscription not found.', 404);
        }

        await subscription.destroy();

        return response(res, subscription, 'Subscription deleted successfully.', 200);
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