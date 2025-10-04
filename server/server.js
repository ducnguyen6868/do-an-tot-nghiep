require("dotenv").config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require("fs");
const path = require("path");
const jwt = require('jsonwebtoken');
const verifyUser = require("./middlewares/authUser");

const app = express();

const bcrypt = require('bcrypt');
const saltRounds = 10;

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
    const rememberMe = req.body.rememberMe;
    // console.log("Info received");
    // console.log(email,password);
    //  console.log(rememberMe===false);
    try {
        const user = await User.findOne({
            email: email
        });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                if (rememberMe === false) {
                    //Create token
                    const token = jwt.sign(
                        {
                            name: user.name,
                            email: user.email,
                            avatar: user.avatar
                        },
                        process.env.JWT_SECRET,
                        { expiresIn: "1h" }
                    )
                    return res.status(200).json({
                        status: "completed",
                        message: "Login sucessful",
                        token
                    });
                } else {
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
                        token //return token to client
                    });
                }
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
    // console.log(avatar);
    // console.log("Name:", name);
    // console.log("Email:", email);
    // console.log("Password:", password);
    // console.log("Avatar file:", avatar);

    if (name && email && password) {
        const isEmail = await User.findOne({
            email: email
        });
        // console.log(isEmail);
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
app.listen(5000, (req, res) => {
    console.log("Server listen port 5000");
})