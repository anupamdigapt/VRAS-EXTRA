
const { response } = require('./response');
const cookie = require('cookie');
const { v4: uuidv4 } = require('uuid');

// Function to generate a random authentication token
const generateAuthToken = () => {
    const token = uuidv4();
    return token;
}

// Function to generate a verification code
const generateCode = (length = 4) => {
    const charset = '0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return code;
};

// Middleware for authentication
const authentication = (req, res, next) => {
    const cookies = req.headers.cookie;

    if (!cookies) {
        // If no cookies found, return 401 Unauthorized
        return response(res, {}, 'Missing authorization cookie.', 401);
    }

    const parsedCookies = cookie.parse(cookies);
    let token = parsedCookies.token;

    if (!token) {
        // If token doesn't exist, generate a new one
        token = generateAuthToken();
        res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/`);
    }

    // Mock user object, replace with actual authentication logic
    const user = { role: 'user' };
    req.user = user;

    next(); // Move to the next middleware or route handler
}

// Middleware for role authorization
const roleAuthorization = (roleString) => (req, res, next) => {
    const { role } = req.user;

    if (!role || role !== roleString) {
        // If user's role doesn't match the required role, return 403 Forbidden
        return response(res, {}, 'Access forbidden.', 403);
    }

    next(); // Move to the next middleware or route handler
}

module.exports = {
    authentication,
    roleAuthorization,
    generateCode
};
