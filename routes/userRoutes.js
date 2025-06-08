import { Router } from "express";
import {getProfile,editProfile} from "../controllers/userController.js";
import auth from "../middleware/authMiddleware.js";
import User from "../models/User.js";

import multer from "multer";
import { storage } from "../config/cloudinary.js";

const upload = multer({ storage });
const router = Router();

// Profile routes
router.get("/profile", auth, getProfile);
router.put("/profile", auth, upload.single("profilePic"), editProfile);

// Public user data route (MUST come after /profile)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("username profilePic");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
