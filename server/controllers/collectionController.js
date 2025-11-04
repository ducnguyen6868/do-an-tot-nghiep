const Collection = require('../models/Collection');

const getCollections = async (req,res)=>{
    try{
        const collections = await Collection.find({})
        .sort({createdAt:-1})
        .limit(4);
        return res.status(200).json({
            message:'Get collection successful.',collections
        });
    }catch(err){
        return res.status(500).json({
            message:'Server error:'+err
        });
    }
}

module.exports = {getCollections}