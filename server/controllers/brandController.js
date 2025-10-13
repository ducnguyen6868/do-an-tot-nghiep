const Brand = require('../models/Brand');

const brand = async(req , res)=>{
    try{
        const brand = await Brand.find();
        if(brand){
            return res.status(200).json({
                message:"Get brand successul",brand
            });
        }else{
            return res.status(400).json({
                message:"No brand found"
            });
        }
    }catch(err){
        return res.status(500).json({
            message:"Server error: "+err.message
        });
    }
}

module.exports = {brand};