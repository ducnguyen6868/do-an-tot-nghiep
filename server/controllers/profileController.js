require('dotenv').config();
const User = require('../models/User');
const saltRounds = parseInt(process.env.SALT_ROUNDS);
const bcrypt= require('bcrypt');

const profile= async (req,res)=>{
    const id= req.user.id;
    const user= await User.findById(id);
    return res.status(200).json({message:"You are logged",user});
}

const changePassword = async (req, res) => {
    const passwords = req.body;
    const email= req.user.email;
    try {
        const user = await User.findOne({email});
        
        if (!user) {
            return res.status(400).json({
                message: "Account does not exist."
            })
        }
        const isMatch = await bcrypt.compare(passwords.currentPassword, user.password);
        if (isMatch) {
            const hashedPassword = await bcrypt.hash(passwords.newPassword, saltRounds);
            await User.findOneAndUpdate({
                email: user.email
            },
                {
                    $set: {
                        password: hashedPassword
                    }
                });
            return res.status(200).json({
                message: "Change password succecfully !"
            });
        } else {
            return res.status(401).json({
                message: "Current password is not correct !"
            });
        }
    } catch (err) {
        return res.status(500).json({
            message: "Server error:" + err.message
        });
    }
}
module.exports = {profile,changePassword};