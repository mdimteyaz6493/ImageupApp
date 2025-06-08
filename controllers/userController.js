import User from "../models/User.js";
import { cloudinary } from "../config/cloudinary.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const editProfile = async (req, res) => {
  const { username, email } = req.body;

  try {
    const updateData = { username, email };

    // Only update profilePic if a new file is uploaded
    if (req.file) {
      updateData.profilePic = req.file.path;
    }

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    console.error("Edit Profile Error:", err);
    res.status(500).json({ error: err.message });
  }
};
