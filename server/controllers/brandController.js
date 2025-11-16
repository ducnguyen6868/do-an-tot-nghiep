const Brand = require('../models/Brand');

const getBrands = async(req , res)=>{
    try{
        const brands = await Brand.find();
        if(brands){
            return res.status(200).json({
                message:"Get brand successul",brands
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

module.exports = {getBrands};