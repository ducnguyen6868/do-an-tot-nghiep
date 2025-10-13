const Category = require('../models/Category');
const category = async(req,res)=>{
    try{
        const category = await Category.find();
        if(category){
            return res.status(200).json({
                message:"Get category successful",category
            });
        }else{
            return res.status(400).json({
                message:"No category found."
            });
        }
    }catch(err){
        return res.status(500).json({
            message:"Server errror: "+err.message
        })
    }
}
module.exports={category};