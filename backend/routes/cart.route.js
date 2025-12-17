import express from "express";
import { addToCart, getCartProducts, removeAllFromCart, updateQuantity, clearCart } from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getCartProducts);
router.post("/", protectRoute, addToCart);
router.delete("/", protectRoute, (req, res) => {
	if (Object.keys(req.body).length === 0) {
		clearCart(req, res);
	} else {
		removeAllFromCart(req, res);
	}
});
router.put("/:id", protectRoute, updateQuantity);

export default router;
