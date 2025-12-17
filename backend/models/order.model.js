import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		products: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					min: 1,
				},
				price: {
					type: Number,
					required: true,
					min: 0,
				},
			},
		],
		totalAmount: {
			type: Number,
			required: true,
			min: 0,
		},
		stripeSessionId: {
			type: String,
			unique: true,
			sparse: true,
		},
		tx_ref: {
			type: String,
			unique: true,
			sparse: true,
		},
		status: {
			type: String,
			enum: ['pending', 'completed', 'failed'],
			default: 'pending',
		},
		paymentStatus: {
			type: String,
			enum: ['pending', 'paid', 'failed'],
			default: 'pending',
		},
		couponCode: {
			type: String,
		},
	},
	{ timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
