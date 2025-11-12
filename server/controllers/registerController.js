require('dotenv').config();
const User = require('../models/User');
const Point = require('../models/Point');
const bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.SALT_ROUNDS);

const registerController = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(401).json({
            message: "Upload information is missing."
        });
    }
    try {
        const isExist = await User.findOne({ email });
        if (isExist) {
            return res.status(400).json({ message: "Email has been registered." });
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const code = 'CUS_' + new Date().getTime();
        const user = await User.create({
            code,
            fullName: name,
            email,
            password: hashedPassword,
            avatar:`https://api.dicebear.com/8.x/avataaars/svg?seed=${code}`
        });
        const point = await Point.create({});
        user.point = point._id;
        await user.save();
        return res.status(201).json({
            message: "Account created."
        });
    } catch (err) {
        return res.status(500).json({
            message: "Server error :" + err
        });
    }
}
module.exports = registerController;