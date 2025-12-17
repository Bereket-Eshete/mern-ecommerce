import User from "../models/user.model.js";
import Order from "../models/order.model.js";

export const getAllUsers = async (req, res) => {
	try {
		const users = await User.find({ role: 'customer' })
			.select('-password -verificationCode -passwordResetToken')
			.sort({ createdAt: -1 });

		res.json(users);
	} catch (error) {
		console.log("Error in getAllUsers controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getAllOrders = async (req, res) => {
	try {
		const orders = await Order.find()
			.populate({
				path: 'user',
				select: 'name email phoneNumber',
				options: { strictPopulate: false }
			})
			.populate({
				path: 'products.product',
				select: 'name price',
				options: { strictPopulate: false }
			})
			.sort({ createdAt: -1 });

		// Filter out orders with missing user data and ensure all fields exist
		const validOrders = orders.filter(order => order.user).map(order => ({
			...order.toObject(),
			user: {
				name: order.user?.name || 'Unknown User',
				email: order.user?.email || 'No Email',
				phoneNumber: order.user?.phoneNumber || null
			},
			products: order.products.map(item => ({
				...item,
				product: {
					name: item.product?.name || 'Deleted Product',
					price: item.product?.price || item.price
				}
			}))
		}));

		res.json(validOrders);
	} catch (error) {
		console.log("Error in getAllOrders controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};