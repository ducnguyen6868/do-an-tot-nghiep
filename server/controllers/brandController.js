const Brand = require('../models/Brand');
const Product = require('../models/Product');

const getBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        if (!brands) {
            return res.status(404).json({
                message: "No brands found"
            });
        } 
        return res.status(200).json({
            message: "Get brand successul", brands
        });
    } catch (err) {
        return res.status(500).json({
            message: "Server error: " + err.message
        });
    }
}

const getBrand = async (req, res) => {
    const { slug } = req.params;
    if (!slug) {
        return res.status(400).json({
            message: 'Couldn`t find route.'
        });
    }
    const brand = await Brand.findOne({ slug });

    if (!brand) {
        return res.status(404).json({
            message: 'No brand found.'
        });
    }
    const products = await Product.find({
        brand:brand._id
    });
    return res.status(200).json({
        message: 'Get brand successful', brand,products
    });

}

module.exports = { getBrands, getBrand };
