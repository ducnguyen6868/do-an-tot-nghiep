const {review ,list} = require('../controllers/ReviewController');

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const express = require('express');
const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads/reviews");

// Tạo thư mục nếu chưa có
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình nơi lưu và tên file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subDir = "others";

    // Phân loại thư mục con theo loại file
    if (file.mimetype.startsWith("image/")) subDir = "images";
    else if (file.mimetype.startsWith("video/")) subDir = "videos";

    const finalPath = path.join(uploadDir, subDir);
    if (!fs.existsSync(finalPath)) fs.mkdirSync(finalPath, { recursive: true });

    cb(null, finalPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const uniqueName = `${base}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

// Cho phép ảnh và video
const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime", // .mov
  "video/x-msvideo", // .avi
  "video/x-matroska", // .mkv
];

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // tối đa 200MB/video
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only image and video files are allowed!"));
  },
});

router.get('/',list);

router.post('/',upload.fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 2 }
  ]),review);
module.exports = router;