const express = require('express');
const v1Routes = require('./v1');


const router = express.Router();

router.use('/v1/football', v1Routes);


module.exports = router;