const { config } = require('dotenv');
const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const cors = require("cors");
const connectDb = require("./config/db.js");
const userRoutes = require("./routes/userRoute.js");
const recipeRoutes = require("./routes/recipeRoute.js"); 
const multer = require('multer');
const path = require('path');

const PORT = process.env.PORT || 5000;
connectDb();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static("uploads"));

// ✅ Mount recipeRoutes without upload.single() here
app.use("/recipe", recipeRoutes);

app.use("/user", userRoutes);

app.listen(PORT, (err) => {
  if (err) return console.error(err);
  console.log(`app is listening on port ${PORT}`);
});
