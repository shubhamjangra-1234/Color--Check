const Express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ColorThief = require("colorthief");
const app = Express();
const ImageModel = require("./Model/Images");

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

app.post("/upload", upload.single("file"), (req, res, file) => {
  ImageModel.create({ image: req.file.filename })
    .then((result) => res.json(result))
    .catch((err) => console.log(err));
});

app.get("/getImage", (req, res) => {
  ImageModel.find()
    .then((result) => res.json(result))
    .catch((err) => console.log(err));
});

app.get("/getImage/:name", (req, res) => {
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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
