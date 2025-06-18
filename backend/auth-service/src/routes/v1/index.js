const express = require('express');
const userRoute = require('./user-route');
const {InfoController} = require('../../controllers');


const router = express.Router();

router.get('/info', InfoController.info);
router.use('/user', userRoute);

module.exports = router;