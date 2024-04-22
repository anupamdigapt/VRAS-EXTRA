const express = require('express');
const group = require('express-group-routes');

// Router
var router = express.Router();

// Common Response
const { response } = require('../config/response');

// JWT Middleware - Auth
const { authentication, roleAuthorization } = require('../config/auth');

// Import Controllers
const { sendEmail } = require('../controllers/api/contactController');
const { register } = require('../controllers/api/auth/registerController');
const { login, logout, vrLogin } = require('../controllers/api/auth/loginController');
const { forgotPassword } = require('../controllers/api/auth/password/forgotPasswordController');
const { resetPassword } = require('../controllers/api/auth/password/resetPasswordController');
const { store } = require('../controllers/api/passwordController');
const { show, update } = require('../controllers/api/profileController');
const subscriptionsController = require('../controllers/api/subscriptionsController');
const permissionsController = require('../controllers/api/permissionsController');
const targetsController = require('../controllers/api/targetsController');
const usersController = require('../controllers/api/usersController');
const sessionsController = require('../controllers/api/sessionsController');
const scenariosController = require('../controllers/api/scenarioController');
const performanceMetricsController = require('../controllers/api/performanceMetricsController');

router.get('/', (req, res) => {
    try {
        return response(res, req.body, 'Welcome API', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
});

// router.post('/contact-mail', sendEmail);
// router.post('/subscriptions', subscriptionsController.index);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/login', login);
router.post('/vrlogin', vrLogin);
router.delete('/logout', [authentication], logout);
router.post('/change-password', [authentication], store);
router.get('/profile', [authentication], show);
router.post('/profile', [authentication], update);
// router.post('/permissions', [authentication], permissionsController.index);

router.group('/targets', (router) => {
    router.use([authentication]);
    router.get('/', targetsController.index);
    router.post('/store', targetsController.store);
    router.get('/show/:id', targetsController.show);
    router.put('/update/:id', targetsController.update);
    router.delete('/destroy/:id', targetsController.destroy);
});

router.group('/users', (router) => {
    router.use([authentication]);
    router.get('/', usersController.index);
    router.post('/store', usersController.store);
    router.get('/show/:id', usersController.show);
    router.put('/update/:id', usersController.update);
    router.delete('/destroy/:id', usersController.destroy);
});

router.group('/sessions', (router) => {
    router.use([authentication]);
    router.get('/', sessionsController.index);
    router.post('/store', sessionsController.store);
    router.get('/show/:id', sessionsController.show);
    router.put('/update/:id', sessionsController.update);
    router.delete('/destroy/:id', sessionsController.destroy);
});

router.group('/scenarios', (router) => {
    router.use([authentication]);
    router.get('/', scenariosController.index);
    router.post('/store', scenariosController.store);
    router.get('/show/:id', scenariosController.show);
    router.put('/update/:id', scenariosController.update);
    router.delete('/destroy/:id', scenariosController.destroy);
});

router.group('/performance-metrics', (router) => {
    router.use([authentication]);
    router.get('/', performanceMetricsController.index);
    router.post('/store', performanceMetricsController.store);
    router.get('/show/:id', performanceMetricsController.show);
    router.put('/update/:id', performanceMetricsController.update);
    router.delete('/destroy/:id', performanceMetricsController.destroy);
    router.get('/export', performanceMetricsController.exportSheets);
});

module.exports = router;