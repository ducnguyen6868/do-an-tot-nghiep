// routes/products.js
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

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

// Middleware để xử lý Multer Upload
function uploadMiddleware (req, res, next) {
    // Sử dụng upload.array() và bắt lỗi thông qua callback
    upload.single('image')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Lỗi do Multer gây ra (ví dụ: FILE_TOO_LARGE)
            let errorMessage = 'Lỗi Upload Ảnh: ';

            if (err.code === 'LIMIT_FILE_SIZE') {
                errorMessage = 'Kích thước file quá lớn. Kích thước tối đa là 5MB.';
            } else {
                errorMessage += err.message;
            }

            // Trả về response lỗi 400 Bad Request
            return res.status(400).json({ 
                success: false, 
                message: errorMessage 
            });
        } else if (err) {
            // Lỗi tùy chỉnh từ fileFilter (ví dụ: định dạng không cho phép)
            // Lỗi trong fileFilter đã được bạn định nghĩa: new Error('Chỉ chấp nhận file ảnh...')
            return res.status(400).json({ 
                success: false, 
                message: err.message // Trả về thông báo lỗi tùy chỉnh của bạn
            });
        }
        
        // Nếu không có lỗi, tiếp tục đến hàm xử lý tiếp theo (postProduct)
        next();
    });
}

module.exports= uploadMiddleware;