import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import { getAllUsers, getAllOrders } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/users", protectRoute, adminRoute, getAllUsers);
router.get("/orders", protectRoute, adminRoute, getAllOrders);

export default router;