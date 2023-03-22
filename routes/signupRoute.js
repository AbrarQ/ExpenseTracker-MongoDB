const express = require('express');
const router = express.Router();
const signupControl = require('../controllers/signupController');


router.post('/save-users', signupControl.saveUsers);

module.exports = router;


