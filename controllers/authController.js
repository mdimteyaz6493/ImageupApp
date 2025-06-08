import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const authController = {
  signup: async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: "Email already exists" });

      const hashed = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashed });
      await user.save();
      res.status(201).json({ message: "User created" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ token, user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  forgotPassword: async (req, res) => {
    const { email, newPassword } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed;
      await user.save();
      res.json({ message: "Password updated" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  changePassword: async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
      const user = await User.findById(req.user.id);
      const match = await bcrypt.compare(oldPassword, user.password);
      if (!match) return res.status(400).json({ message: "Old password incorrect" });

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      res.json({ message: "Password changed" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

export default authController;
