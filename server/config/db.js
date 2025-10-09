require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE_URL);
        console.log("Database conneted.");
    } catch {
        console.log("Can not connect with database.");
        process.exit(1);
    }
}
module.exports = connectDB;