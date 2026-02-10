import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import ColorThief from "colorthief";
import ImageModel from "./Model/Images.js";

dotenv.config();

// Database connection with error handling
try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');
} catch (error) {
  console.error('❌ MongoDB connection failed:', error.message);
  console.log('⚠️  Server will continue without database connection');
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const app = express();

app.use(cors());
app.use(Express.json());
app.use(Express.static("Public"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/Images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  // Check database connection before proceeding
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'Database not connected' });
  }
  
  ImageModel.create({ image: req.file.filename })
    .then((result) => res.json(result))
    .catch((err) => console.log(err));
});

app.get("/getImage", (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'Database not connected' });
  }
  
  ImageModel.find()
    .then((result) => res.json(result))
    .catch((err) => console.log(err));
});

app.get("/getImage/:name", (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'Database not connected' });
  }
  
  const imageName = req.params.name;
  ImageModel.findOne({ image: imageName })
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.status(404).send("Image not found");
      }
    })
    .catch((err) => console.log(err));
});

app.get("/getDominantColor/:name", (req, res) => {
  const imageName = req.params.name;
  const imagePath = path.join(__dirname, "Public/Images", imageName);

  ColorThief.getColor(imagePath)
    .then((color) => res.json({ dominantColor: color }))
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error extracting color");
    });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    console.log('⚠️  Please use a different port or stop the other process');
  } else {
    console.error('❌ Server error:', error);
  }
  process.exit(1);
});
