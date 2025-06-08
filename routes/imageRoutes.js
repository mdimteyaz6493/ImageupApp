import { Router } from "express";
import imageCtrl from "../controllers/imageController.js";
import auth from "../middleware/authMiddleware.js";

import multer from "multer";
import { storage } from "../config/cloudinary.js"; // ⬅️ Use `.js` extension

const upload = multer({ storage });
const router = Router();

router.post("/upload", auth, upload.single("image"), imageCtrl.uploadImage);
router.delete("/:id", auth, imageCtrl.deleteImage);
router.get("/", imageCtrl.getAllImages); // <-- This must come BEFORE ":id"

// More specific routes first
router.get("/download/:id", imageCtrl.downloadImage);
router.post("/favorite/:id", auth, imageCtrl.toggleFavorite);
router.get("/favorites/list", auth, imageCtrl.getFavorites);
router.get("/favorites", auth, imageCtrl.getFavoritesID);
router.get("/:userId/images", auth, imageCtrl.getImagesByUser);
router.put("/update/:id", auth, imageCtrl.updateImage);

// Place this LAST
router.get("/:id", imageCtrl.getImage); // <-- Least specific


export default router;