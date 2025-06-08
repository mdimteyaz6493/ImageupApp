import Image from "../models/Image.js";
import User from "../models/User.js";
import { cloudinary } from "../config/cloudinary.js";

const imageController = {
  uploadImage: async (req, res) => {
  const { title, category, description } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const image = new Image({
      title,
      category,
      description,
      imageUrl: req.file.path, // Cloudinary URL
      publicId: req.file.filename, // Cloudinary public_id
      uploader: req.user.id,
    });

    await image.save();
    res.status(201).json(image);
  } catch (err) {
    console.error("Upload Error:", err); // log for debugging
    res.status(500).json({ error: "Image upload failed" });
  }
},

  deleteImage: async (req, res) => {
    try {
      const image = await Image.findById(req.params.id);
      if (!image) return res.status(404).json({ message: "Image not found" });

      await Image.findByIdAndDelete(req.params.id);
      res.json({ message: "Image deleted" });
    } catch (err) {
      console.error("Delete Error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  getAllImages: async (req, res) => {
    try {
      const images = await Image.find().populate("uploader", "username");
      res.json(images);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getImage: async (req, res) => {
    try {
      const image = await Image.findById(req.params.id).populate("uploader", "username");
      if (!image) return res.status(404).json({ message: "Image not found" });
      res.json(image);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  downloadImage: async (req, res) => {
    try {
      const image = await Image.findById(req.params.id);
      if (!image) return res.status(404).json({ message: "Image not found" });

      res.redirect(image.imageUrl);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  toggleFavorite: async (req, res) => {
    try {
      const userId = req.user?.id;
      const imageId = req.params?.id;

      if (!userId || !imageId) {
        return res.status(400).json({ error: 'User ID or Image ID missing' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isFav = user.favorites.includes(imageId);

      if (isFav) {
        user.favorites.pull(imageId);
      } else {
        user.favorites.push(imageId);
      }

      await user.save();
      res.status(200).json({ favorites: user.favorites });
    } catch (err) {
      console.error('Toggle Favorite Error:', err);
      res.status(500).json({ error: 'Server error. Please try again later.' });
    }
  },

  getFavorites: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).populate("favorites");
      res.json(user.favorites);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getFavoritesID: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).populate("favorites", "_id");
      const favoriteIds = user.favorites.map(fav => fav._id.toString());
      res.json(favoriteIds);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getImagesByUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      const images = await Image.find({ uploader: userId }).populate("uploader", "username");
      res.status(200).json(images);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updateImage: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, category } = req.body;

      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const image = await Image.findById(id);
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }

      if (image.uploader.toString() !== req.user.id) {
        return res.status(403).json({ message: "You are not allowed to update this image" });
      }

      image.title = title || image.title;
      image.description = description || image.description;
      image.category = category || image.category;

      const updatedImage = await image.save();
      res.status(200).json(updatedImage);
    } catch (err) {
      console.error("🔥 UPDATE ERROR:", err);
      res.status(500).json({ error: "Server error while updating image" });
    }
  }
};

export default imageController;
