const profileController= async (req,res)=>{
    const user= req.user;
    return res.status(200).json({message:"You are logged",user});
}
module.exports = profileController;