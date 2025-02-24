const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/Images");

const ImageSchema = new mongoose.Schema({
    image:String,
})
const ImageModel = mongoose.model("Images", ImageSchema);
module.exports = ImageModel;