const Collection = require('../models/Collection');
const Product = require('../models/Collection');

const getCollections = async (req,res)=>{
    try{
        const collections = await Collection.find({})
        .sort({createdAt:-1})
        return res.status(200).json({
            message:'Get collection successful.',collections
        });
    }catch(err){
        return res.status(500).json({
            message:'Server error:'+err
        });
    }
}

const getCollection = async (req, res) => {
    const { slug } = req.params;
    if (!slug) {
        return res.status(400).json({
            message: 'Couldn`t find route.'
        });
    }
    const collection = await Collection.findOne({ slug }).populate('products');

    if (!collection) {
        return res.status(404).json({
            message: 'No collection found.'
        });
    }
 
   const products = collection.products;
    return res.status(200).json({
        message: 'Get collection successful', collection,products
    });

}

module.exports = {getCollections , getCollection}