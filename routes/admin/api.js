const express = require('express');
const group = require('express-group-routes');

// Router
var router = express.Router();

// Common Response
const { response } = require('../../config/response');

// JWT Middleware - Auth
const { authentication, roleAuthorization } = require('../../config/auth');

// Import Controllers
const { login, logout } = require('../../controllers/admin/api/auth/loginController');
const { forgotPassword } = require('../../controllers/admin/api/auth/password/forgotPasswordController');
const { resetPassword } = require('../../controllers/admin/api/auth/password/resetPasswordController');
const { store } = require('../../controllers/admin/api/passwordController');
const permissionsController = require('../../controllers/admin/api/permissionsController');
const weaponsController = require('../../controllers/admin/api/weaponsController');
const subscriptionsController = require('../../controllers/admin/api/subscriptionsController');
const clientsController = require('../../controllers/admin/api/clientsController');

router.get('/', (req, res) => {
    try {
        return response(res, req.body, 'Welcome Admin API', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
});

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/login', login);
router.delete('/logout', authentication, logout);
router.post('/change-password', authentication, store);

router.group('/permissions', (router) => {
    router.use(authentication);
    router.get('/', permissionsController.index);
    router.post('/store', permissionsController.store);
    router.get('/show/:id', permissionsController.show);
    router.put('/update/:id', permissionsController.update);
    router.delete('/destroy/:id', permissionsController.destroy);
});

router.group('/weapons', (router) => {
    router.use(authentication);
    router.get('/', weaponsController.index);
    router.post('/store', weaponsController.store);
    router.get('/show/:id', weaponsController.show);
    router.put('/update/:id', weaponsController.update);
    router.delete('/destroy/:id', weaponsController.destroy);
});

router.group('/subscriptions', (router) => {
    router.use(authentication);
    router.get('/', subscriptionsController.index);
    router.post('/store', subscriptionsController.store);
    router.get('/show/:id', subscriptionsController.show);
    router.put('/update/:id', subscriptionsController.update);
    router.delete('/destroy/:id', subscriptionsController.destroy);
});

router.group('/clients', (router) => {
    router.use(authentication);
    router.get('/', clientsController.index);
    router.post('/store', clientsController.store);
    router.get('/show/:id', clientsController.show);
    router.put('/update/:id', clientsController.update);
    router.delete('/destroy/:id', clientsController.destroy);
    router.post('/change-status/:id', clientsController.changeStatus);
});

module.exports = router;