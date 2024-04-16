// Validator
const { Validator } = require('node-input-validator');

// Common Response
const { response } = require('../../../config/response');

// Model
const { Op } = require('sequelize');
const { Permission } = require('../../../models/Permission');

const index = async (req, res) => {
    try {
        let {
            page,
            length
        } = req.query;
        page = page > 0 ? parseInt(page) : 1;
        length  = length > 0 ? parseInt(length) : 10;
        let offset = (page - 1) * length;

        const { count: total, rows: permissions } = await Permission.findAndCountAll({
            order: [
                ['name', 'ASC']
            ],
            limit: length,
            offset: offset
        });

        return response(res, { permissions, total }, 'Permissions list.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const store = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            name: 'required',
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        let errors = {};
        const {
            name,
            module,
            type,
            description
        } = req.body;

        const nameCount = await Permission.count({
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

        const moduleCount = await Permission.count({
            where: {
                [Op.and]: [
                    { module: { [Op.eq]: module } },
                    { type: { [Op.eq]: type } }
                ]
            }
        });
        if (moduleCount > 0) {
            errors['module'] = {
                message: 'The module combination already exists.',
                rule: 'unique'
            };
        }

        if (Object.keys(errors).length > 0) {
            return response(res, errors, 'validation', 422);
        }

        const permission = new Permission();
        permission.name = name;
        permission.module = module;
        permission.type = type;
        if (description) {
            permission.description = description;
        }
        await permission.save();

        return response(res, permission, 'Permission saved successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const show = async (req, res) => {
    try {
        const { id } = req.params;

        const permission = await Permission.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!permission) {
            return response(res, permission, 'Permission not found.', 404);
        }

        return response(res, permission, 'Permission details.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const update = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            name: 'required',
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        let errors = {};
        const { id } = req.params;
        const {
            name,
            module,
            type,
            description
        } = req.body;

        const nameCount = await Permission.count({
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

        const moduleCount = await Permission.count({
            where: {
                [Op.and]: [
                    { module: { [Op.eq]: module } },
                    { type: { [Op.eq]: type } },
                    { id: { [Op.ne]: id } }
                ]
            }
        });
        if (moduleCount > 0) {
            errors['module'] = {
                message: 'The module combination already exists.',
                rule: 'unique'
            };
        }

        if (Object.keys(errors).length > 0) {
            return response(res, errors, 'validation', 422);
        }

        const permission = await Permission.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!permission) {
            return response(res, permission, 'Permission not found.', 404);
        }

        permission.name = name;
        permission.module = module;
        permission.type = type;
        if (description) {
            permission.description = description;
        }
        await permission.save();

        return response(res, permission, 'Permission updated successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const permission = await Permission.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!permission) {
            return response(res, permission, 'Permission not found.', 404);
        }

        await permission.destroy();

        return response(res, permission, 'Permission deleted successfully.', 200);
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