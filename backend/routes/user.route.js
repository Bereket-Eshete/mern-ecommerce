import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUserOrders, getUserStats } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/orders", protectRoute, getUserOrders);
router.get("/stats", protectRoute, getUserStats);

export default router;