import Order from "../models/order.model.js";

export const getUserOrders = async (req, res) => {
	try {
		const orders = await Order.find({ user: req.user._id })
			.populate('products.product')
			.sort({ createdAt: -1 });

		res.json(orders);
	} catch (error) {
		console.log("Error in getUserOrders controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getUserStats = async (req, res) => {
	try {
		const totalOrders = await Order.countDocuments({ user: req.user._id });
		const completedOrders = await Order.countDocuments({ user: req.user._id, status: 'completed' });
		const totalSpent = await Order.aggregate([
			{ $match: { user: req.user._id, status: 'completed' } },
			{ $group: { _id: null, total: { $sum: '$totalAmount' } } }
		]);

		res.json({
			totalOrders,
			completedOrders,
			totalSpent: totalSpent[0]?.total || 0
		});
	} catch (error) {
		console.log("Error in getUserStats controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};