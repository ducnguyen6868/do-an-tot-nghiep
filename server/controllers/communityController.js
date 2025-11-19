const Community = require('../models/Community');

const getCommunities= async (req,res)=>{
    try{
        const page = req.query.page||1;
        const limit = req.query.limit||4;
        const skip=(page-1)*limit;

        const communities = await Community.find({})
        .sort({
            createdAt:-1
        })
        .skip(skip)
        .limit(limit);
        return res.status(200).json({
            message:'Get list communities successful.',communities
        })
    }catch(err){
        return res.status(500).json({
            message:'Server error :'+ err.message
        });
    }
}

module.exports ={getCommunities};