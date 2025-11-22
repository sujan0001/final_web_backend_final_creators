require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const userRoute=require('./routes/userRoute')
const collectionRoutes = require("./routes/collectionRoutes");
const productRoute=require('./routes/productRoute')
const app = express();
const path = require("path") 
const PORT = process.env.PORT || 5050;




connectDB();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")))
console.log("Serving static files from:", path.join(__dirname, "uploads"));

//routes
app.use("/api/auth",userRoute);
app.use("/api/collections", collectionRoutes);
app.use("/api/product", productRoute);






//test route
app.get('/hey', (req, res) => {
  res.send('Hello World!');
});

//start server
app.listen(PORT, () => {
  console.log(`Server running on port number ${PORT}`);
});

