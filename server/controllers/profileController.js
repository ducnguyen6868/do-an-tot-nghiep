require('dotenv').config();
const User = require('../models/User');

const saltRounds = parseInt(process.env.SALT_ROUNDS);
const bcrypt= require('bcrypt');

const profile= async (req,res)=>{
    try{
        const id= req.user.id;
        const user= await User.findById(id).populate('addresses');
        const point = user.point||[];
        const addresses = user.addresses;
        return res.status(200).json({message:"You are logged",user,point, addresses});
    }catch(err){
        return res.status(500).json({
            message:'Server error : '+err.message
        });
    }
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


const patchAvatar = async (req, res) => {

    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.avatar = 'uploads/avatars/'+ req.file.filename;
      await user.save();

      res.json({ avatar: user.avatar });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }

};

const patchPersonal = async(req,res)=>{
    try{

        const userId = req.user.id;
        const {fullName,phone}=req.body;
        if(!fullName||!phone){
            return res.status(400).json({
                message:'Missing feilds from data.'
            });
        }
        const user= await User.findById(userId);
        if(!user){
            return res.status(404).json({
                message:'User not found'
            });
        }

        user.fullName=fullName;
        user.phone=phone;
        
        await user.save();
        
        return res.status(200).json({
            message:'Updated personal info'
        });

    }catch(err){
        return res.status(500).json({
            message:'Server error: '+ err.message
        });
    }
}

module.exports = {profile,changePassword , patchAvatar ,patchPersonal};