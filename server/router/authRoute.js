import express from "express";
import authController from "../controller/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router()

router.post('/register',authController.registerUser)
router.post('/login',authController.loginUser)
router.get('/me', protect, authController.getMe)

export default router