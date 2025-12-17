import { Chapa } from 'chapa-nodejs';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Chapa with secret key
export const chapa = new Chapa({
	secretKey: process.env.CHAPA_SECRET_KEY,
});

// Generate transaction reference
export const generateTxRef = async () => {
	return await chapa.genTxRef({
		prefix: 'ECOM',
		size: 20,
	});
};

// Initialize payment
export const initializePayment = async (paymentData) => {
	try {
		const response = await chapa.initialize({
			first_name: paymentData.first_name,
			last_name: paymentData.last_name,
			email: paymentData.email,
			phone_number: paymentData.phone_number,
			currency: 'ETB',
			amount: paymentData.amount,
			tx_ref: paymentData.tx_ref,
			callback_url: process.env.CHAPA_CALLBACK_URL,
			return_url: `${process.env.CLIENT_URL}/purchase-success`,
			customization: {
				title: 'Ecommerce Store Payment',
				description: 'Payment for your order',
			},
		});
		return response;
	} catch (error) {
		console.error('Chapa initialization error:', error);
		throw error;
	}
};

// Verify payment
export const verifyPayment = async (tx_ref) => {
	try {
		const response = await chapa.verify({ tx_ref });
		return response;
	} catch (error) {
		console.error('Chapa verification error:', error);
		throw error;
	}
};