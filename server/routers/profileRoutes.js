const express= require('express');
const verifyUser= require('../middlewares/authUser');
const {profile,changePassword} = require('../controllers/profileController');

const router = express.Router();
router.get('/',verifyUser,profile);
router.post('/change-password',verifyUser,changePassword);

module.exports= router;