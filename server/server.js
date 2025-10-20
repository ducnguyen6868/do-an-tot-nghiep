const express = require('express');
const cors = require('cors');
const path = require("path");

const app = express();

const userRoutes = require('./routers/userRoutes');
const profileRoutes = require('./routers/profileRoutes');
const productRoutes = require('./routers/productRoutes');
const categoryRoutes = require('./routers/categoryRoutes');
const brandRoutes = require('./routers/brandRoutes');
const recipientRoutes = require('./routers/recipientRoutes');
const orderRoutes = require('./routers/orderRoutes');

const connectDB = require('./config/db');
connectDB();

// Middleware
app.use(cors()); // cho phép frontend gọi API
app.use(express.json()); // parse JSON từ body request

//Dir static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/', userRoutes);

app.use("/profile", profileRoutes);

app.use("/product", productRoutes);

app.use("/category", categoryRoutes);

app.use("/brand", brandRoutes);

app.use('/recipient', recipientRoutes);

app.use('/order',orderRoutes);

app.listen(5000, (req, res) => {
    console.log("Server listen port 5000");
})