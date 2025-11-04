const express = require('express');
const cors = require('cors');
const path = require("path");

const app = express();

const userRoutes = require('./routers/userRoutes');
const profileRoutes = require('./routers/profileRoutes');
const productRoutes = require('./routers/productRoutes');
const categoryRoutes = require('./routers/categoryRoutes');
const brandRoutes = require('./routers/brandRoutes');
const addressRoutes = require('./routers/addressRoutes');
const orderRoutes = require('./routers/orderRoutes');
const reviewRoutes = require('./routers/reviewRoutes');
const pointRoutes = require('./routers/pointRoutes');
const promotionRoutes = require('./routers/promotionRoutes');
const collectionRoutes = require('./routers/collectionRoutes');

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

app.use('/address', addressRoutes);

app.use('/order',orderRoutes);

app.use('/review',reviewRoutes);

app.use('/point',pointRoutes);

app.use('/promotion',promotionRoutes);

app.use('/collection',collectionRoutes);

app.listen(5000, (req, res) => {
    console.log("Server listen port 5000");
});
