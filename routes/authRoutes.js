import { Router} from "express";
import authController from "../controllers/authController.js"; // ✅ default import
import auth from "../middleware/authMiddleware.js";

const router = Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/change-password", auth, authController.changePassword);

export default router;
