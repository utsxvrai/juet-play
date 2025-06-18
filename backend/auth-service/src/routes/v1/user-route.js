const { UserController } = require('../../controllers');
const { AuthRequestMiddlewares } = require('../../middlewares');
const express = require('express');
const router = express.Router();


router.post('/register', AuthRequestMiddlewares.validateAuthRequest, UserController.signup);

router.post('/login', AuthRequestMiddlewares.validateAuthRequest, UserController.signin);



module.exports = router;