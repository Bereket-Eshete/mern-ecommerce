import { initializePayment, verifyPayment, generateTxRef } from "../lib/chapa.js";
import Order from "../models/order.model.js";
import Coupon from "../models/coupon.model.js";

export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode, customerInfo } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		if (!customerInfo || !customerInfo.first_name || !customerInfo.last_name || !customerInfo.email || !customerInfo.phone_number) {
			return res.status(400).json({ error: "Customer information is required" });
		}

		let totalAmount = 0;

		// Calculate total amount
		products.forEach((product) => {
			totalAmount += product.price * product.quantity;
		});

		// Apply coupon if provided
		let coupon = null;
		if (couponCode) {
			coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
			if (coupon) {
				totalAmount -= (totalAmount * coupon.discountPercentage) / 100;
			}
		}

		// Generate transaction reference
		const tx_ref = await generateTxRef();

		// Initialize Chapa payment
		const paymentData = {
			first_name: customerInfo.first_name,
			last_name: customerInfo.last_name,
			email: customerInfo.email,
			phone_number: customerInfo.phone_number,
			amount: totalAmount.toString(),
			tx_ref: tx_ref,
		};

		const response = await initializePayment(paymentData);

		// Store order data temporarily (you might want to use Redis or database)
		// For now, we'll create a pending order
		const pendingOrder = new Order({
			user: req.user._id,
			products: products.map((product) => ({
				product: product._id,
				quantity: product.quantity,
				price: product.price,
			})),
			totalAmount: totalAmount,
			tx_ref: tx_ref,
			status: 'pending',
			couponCode: couponCode || null,
		});
		await pendingOrder.save();

		// Create coupon for large orders
		if (totalAmount >= 2000) { // 2000 ETB threshold
			await createNewCoupon(req.user._id);
		}

		res.status(200).json({ 
			checkout_url: response.data.checkout_url,
			tx_ref: tx_ref,
			totalAmount: totalAmount 
		});
	} catch (error) {
		console.error("Error processing checkout:", error);
		res.status(500).json({ message: "Error processing checkout", error: error.message });
	}
};

export const chapaCallback = async (req, res) => {
	try {
		console.log('📨 Chapa callback received:', JSON.stringify(req.body, null, 2));
		const { tx_ref, status } = req.body;
		
		console.log('🔍 Extracted data:', { tx_ref, status });

		if (status === 'success') {
			// Verify the payment
			const verification = await verifyPayment(tx_ref);
			
			if (verification.status === 'success' && verification.data.status === 'success') {
				// Update order status
				const order = await Order.findOne({ tx_ref: tx_ref });
				if (order) {
					order.status = 'completed';
					order.paymentStatus = 'paid';
					await order.save();

					// Deactivate coupon if used
					if (order.couponCode) {
						await Coupon.findOneAndUpdate(
							{ code: order.couponCode, userId: order.user },
							{ isActive: false }
						);
					}
				}
			}
		} else {
			// Payment failed, update order status
			await Order.findOneAndUpdate(
				{ tx_ref: tx_ref },
				{ status: 'failed', paymentStatus: 'failed' }
			);
		}

		res.status(200).json({ message: 'Callback processed' });
	} catch (error) {
		console.error("Error processing Chapa callback:", error);
		res.status(500).json({ message: "Error processing callback", error: error.message });
	}
};

export const checkoutSuccess = async (req, res) => {
	try {
		const { tx_ref } = req.body;
		
		// Verify payment with Chapa
		const verification = await verifyPayment(tx_ref);
		
		if (verification.status === 'success' && verification.data.status === 'success') {
			const order = await Order.findOne({ tx_ref }).populate('products.product');
			
			if (order) {
				res.status(200).json({
					success: true,
					message: "Payment successful!",
					order: order
				});
			} else {
				res.status(404).json({ message: "Order not found" });
			}
		} else {
			res.status(400).json({ message: "Payment verification failed" });
		}
	} catch (error) {
		console.error("Error processing successful checkout:", error);
		res.status(500).json({ message: "Error processing successful checkout", error: error.message });
	}
};

async function createNewCoupon(userId) {
	await Coupon.findOneAndDelete({ userId });

	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
		userId: userId,
	});

	await newCoupon.save();

	return newCoupon;
}