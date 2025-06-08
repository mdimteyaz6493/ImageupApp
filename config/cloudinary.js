import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Configure Cloudinary with credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Setup multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "image-gallery", // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png", "webp"], // Accepted image formats
    transformation: [{ width: 800, height: 800, crop: "limit" }] // Optional resize
  }
});

export { cloudinary, storage };
