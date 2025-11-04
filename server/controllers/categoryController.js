const Category = require('../models/Category');

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        return res.status(200).json({
            message: "Get category successful", categories
        });

    } catch (err) {
        return res.status(500).json({
            message: "Server errror: " + err.message
        })
    }
}
module.exports = { getCategories };