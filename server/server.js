require("dotenv").config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require("fs");
const path = require("path");
const jwt = require('jsonwebtoken');
const verifyUser = require("./middlewares/authUser");
const nodemailer = require('nodemailer');

const app = express();

const bcrypt = require('bcrypt');
const saltRounds = 10;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
})
const mongoose = require('mongoose');

// Middleware
app.use(cors()); // cho phép frontend gọi API
app.use(express.json()); // parse JSON từ body request

//Dir static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect("mongodb://localhost:27017/timepiece")
    .then(() => console.log("Mongodb connected"))
    .catch((err) => console.log("Mongodb connection errror", err));


//Create uploads folder

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình lưu file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // thư mục lưu file
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });
//Import models

const User = require('./models/User');

//API Login
app.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({
            email: email
        });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                //Create token
                const token = jwt.sign(
                    {
                        name: user.name,
                        email: user.email,
                        avatar: user.avatar
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: "24h" }
                )
                return res.status(200).json({
                    status: "completed",
                    message: "Login sucessful",
                    token
                });

            }
            // console.log("Login sucessful !");
            else {
                return res.status(401).json({
                    status: "error",
                    message: "Invalid email or password !"
                });
            }
        }
        else {
            return res.status(404).json({
                status: "error",
                message: "Invalid email or password !"
            })
            // console.log("Incorrect login information :(( ");
        }
    } catch (err) {
        console.log("Cann`t connect with database", err);
        return res.status(500).json({
            status: "error",
            message: "Server error. Try again later..."
        })
    }

});
//API register

app.post("/register", upload.single("avatar"), async (req, res) => {
    const { name, email, password } = req.body;
    const avatar = req.file; // file avatar

    if (name && email && password) {
        const isEmail = await User.findOne({
            email: email
        });
        if (isEmail) {
            res.status(200).json({
                status: "error",
                message: "Email is registered !"
            })
        } else {

            const hashedPassword = await bcrypt.hash(password, saltRounds);
            try {
                const user = await User.create(
                    {
                        name: name,
                        email: email,
                        password: hashedPassword,
                        avatar: avatar ? "uploads/" + avatar.filename : ""
                    }
                )
                if (user) {
                    return res.status(200).json({
                        status: "completed",
                        message: "Register completed !"
                    })
                } else {
                    return res.status(500).json({
                        status: "error",
                        message: "Cann`t create a new user..."
                    });
                }
            } catch (err) {
                return res.status(500).json({
                    status: "error",
                    message: "Server error :", err
                });
            }
        }
    } else {
        return res.status(500).json({
            status: "error",
            message: "Missing required fields"
        });
    }
});

//API profile ( have authentication login)

app.get("/profile", verifyUser, async (req, res) => {
    return res.status(200).json({
        status: "completed",
        message: "You are logged.",
        user: req.user
    })
});

app.post("/profile/change-password", verifyUser, async (req, res) => {
    const data = req.body;
    const user = req.user;
    try {
        const findUser = await User.findOne({
            email: user.email
        });
        if (findUser) {
            const isMatch = await bcrypt.compare(data.currentPassword, findUser.password);
            if (isMatch) {
                const hashedPassword = await bcrypt.hash(data.currentPassword, saltRounds);
                await User.findOneAndUpdate({
                    email: user.email
                },
                    {
                        $set: {
                            password: hashedPassword
                        }
                    });
                return res.status(200).json({
                    status: "completed",
                    message: "Change password succecfully !"
                });
            } else {
                return res.status(401).json({
                    status: "failed",
                    message: "Current password is not correct !"
                });
            }
        }
    } catch (err) {
        return res.status(500).json({
            status: "failed",
            message: err
        });
    }

});

//Send OTP
app.post("/send-otp", async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
        try {
            //Creat OTP and time expired
            const otp = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
                const otpHashed = await bcrypt.hash(String(otp), saltRounds);
            const timeExpried = Date.now() + 1000 * 60 * 15 //Expried after 15 minutes

            await transporter.sendMail({
                from: 'ducabc2k3@gmail.com',
                to: email,
                subject: 'Mã OTP đặt lại mật khẩu',
                html: `<div style="font-family:Arial,sans-serif">
                    <h2 style="color:#5eff00">Xác nhận đặt lại mật khẩu</h2>
                    <p>Xin chào ${user.name},</p>
                    <p>Mã OTP của bạn là:</p>
                    <h3 style="font-size:24px;color:#ff0077">${otp}</h3>
                    <p>Mã sẽ hết hạn sau <b>15 phút</b>. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                </div>`
            });
            await User.findOneAndUpdate(
                {
                    email: email
                }, {
                $set: {
                    resetPasswordOTP: otpHashed,
                    resetPasswordOTPExpiry: timeExpried
                }
            });
            return res.status(200).json({
                status: "completed",
                message: "OTP sended"
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                status: "error",
                message: "Server error"
            });
        }

    } else {
        res.status(404).json({
            status: "failed",
            message: "Email does not exist"
        })
    }
});

//Verify OTP
app.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            const isMatch = await bcrypt.compare(otp, user.resetPasswordOTP);
            if (isMatch) {
                if (User.resetPasswordOTPExpiry < Date.now()) {
                    return res.status(400).json({
                        status: "failed",
                        message: "OTP has expired. Please request a new one."
                    });
                } else {
                    return res.status(200).json({
                        status: "completed",
                        message: "OTP verified successfully. You can set your new password now."
                    });
                }
            } else {
                res.status(403).json({
                    status: "failed",
                    message: "OTP is not correct."
                })
            }
        } else {
            return res.status(404).json({
                status: "failed",
                message: "Account is not exist"
            })
        }
    } catch (err) {
        return res.status(500).json({
            status: "failed",
            message: "Server error :" + err
        })
    }
});

// Reset password
app.post("/reset-password", async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Email does not exist." });
        }

        if (!user.resetPasswordOTP) {
            return res.status(400).json({ message: "No OTP found. Please request a new OTP." });
        }

        if (user.resetPasswordOTPExpiry < Date.now()) {
            return res.status(400).json({ message: "OTP has expired. Please request again." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        await User.findOneAndUpdate(
            { email },
            {
                $set: {
                    password: hashedPassword,
                    resetPasswordOTP: "",
                    resetPasswordOTPExpiry: null,
                },
            }
        );

        return res.status(200).json({ success: true, message: "Password reset successfully!" });

    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});
app.listen(5000, (req, res) => {
    console.log("Server listen port 5000");
})