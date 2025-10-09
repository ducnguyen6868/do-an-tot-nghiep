const express= require('express');
const verifyUser= require('../middlewares/authUser');
const profileController = require('../controllers/profileController');
const changePasswordController = require('../controllers/changePasswordController');

const router = express.Router();
router.get('/',verifyUser,profileController);
router.post('/change-password',verifyUser,changePasswordController);

module.exports= router;