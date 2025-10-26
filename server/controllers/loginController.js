require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const loginController = async(req,res)=>{
    const {email , password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            message:"Infomation upload is missing"
        })
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password!" });
        }

        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,user
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error. Please try again later.",
        });
    }
}
module.exports = loginController;
