// authMiddleware.js

const { User } = require('../models/User');
const { response } = require('../config/response');
const cookie = require('cookie');

const authentication = async (req, res, next) => {
    try {
        
        const authToken = req.cookies.authToken;
        if (!authToken) {
            return response(res, {}, 'Unauthorized', 401);
        }

        const user = await User.findOne({ where: { token: authToken } });
        if (!user) {
            return response(res, {}, 'Unauthorized', 401);
        }
        req.user = user;

        next(); 
    } catch (error) {
        return response(res, {}, 'Internal Server Error', 500);
    }
}

module.exports = {
    authentication
}
