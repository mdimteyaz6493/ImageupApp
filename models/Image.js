import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  title: String,
  category: {
    type: String,
    enum: [
  'Pixel',
  'Gubhly',
  'Car',
  'Cartoon',
  'Cute',
  'Asthetic',
  'Motivation',
  'Buildings',
  'Posters',
  'Wallpapers',
  'Fashions',
  'Technology',
  'Super Hero',
  'Gadgets',
  'Computer',
  'Mobile phones',
  'Food',
  'Clothes',
  'Anime style',
  'Realistic',
  'Anime',
  'Disney Character',
  'Animals',
  'Logo and Icon',
  'UI design',
  'Scenery'
]
,
    required: true
  },
  description: String,
  imageUrl: String,       // Cloudinary image URL
  publicId: String,       // Needed to delete from Cloudinary
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

const Image = mongoose.model("Image", imageSchema);

export default Image;
