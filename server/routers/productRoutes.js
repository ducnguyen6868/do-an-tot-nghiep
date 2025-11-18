// routes/products.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const {
    getProducts, search, getProduct, deleteProduct,
    wishlist, postProduct, postImgToSearch,
    getTrendingProducts, getFlashSaleProducts,
    patchStock
} = require("../controllers/productController");

const uploadMiddleware = require('../middlewares/uploadMiddleware');

// Cấu hình multer để upload ảnh
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = './uploads/products/';
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueName + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp|jfif/;
        const extname = allowedTypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only accept images (jpeg, jpg, png, webp ,jfif)'));
    }
});     


router.post('/add', upload.array('images'), postProduct);
router.post('/search-by-image', uploadMiddleware, postImgToSearch);
router.get('/search', search);
router.delete('/delete/:productId', deleteProduct);
router.get('/trending', getTrendingProducts);
router.get('/flash-sale', getFlashSaleProducts);
router.post('/wishlist', wishlist);
router.patch('/stock/update', patchStock);
router.get('/:slug', getProduct);
router.get('/', getProducts);
module.exports = router;