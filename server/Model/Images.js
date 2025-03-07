const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUNifiedTopology:true,
});

const ImageSchema = new mongoose.Schema({
    image:String,
})
const ImageModel = mongoose.model("Images", ImageSchema);
module.exports = ImageModel;