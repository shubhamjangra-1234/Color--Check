import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
    image: String,
});

export default mongoose.model("Images", ImageSchema);