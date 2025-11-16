const verifyUser= require('../middlewares/authUser');
const {profile,changePassword , 
    patchAvatar ,patchPersonal} = require('../controllers/profileController');

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const express = require('express');

const uploadDir = path.join(process.cwd(), "uploads/avatars/");

// Tạo thư mục nếu chưa có
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (['.png', '.jpg', '.jpeg'].includes(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  },
});

const router = express.Router();


router.get('/',verifyUser,profile);
router.post('/change-password',verifyUser,changePassword);
router.patch('/avatar/change',verifyUser,upload.single('avatar'),patchAvatar);
router.patch('/personal/change',verifyUser,patchPersonal);

module.exports= router;