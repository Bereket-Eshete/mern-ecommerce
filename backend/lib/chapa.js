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
		// Validate required fields
		const requiredFields = ['first_name', 'last_name', 'email', 'phone_number', 'amount', 'tx_ref'];
		for (const field of requiredFields) {
			if (!paymentData[field]) {
				throw new Error(`Missing required field: ${field}`);
			}
		}

		// Use test phone number for Chapa test mode
		let phone = paymentData.phone_number.toString();
		// For test mode, use a simple format
		if (phone.startsWith('0')) {
			phone = phone; // Keep as is: 0911234567
		} else if (phone.length === 9) {
			phone = '0' + phone; // Add leading 0: 0911234567
		}

		// Payload matching working booking app format
		const chapaPayload = {
			first_name: paymentData.first_name,
			last_name: paymentData.last_name,
			email: paymentData.email,
			phone_number: phone,
			currency: 'ETB',
			amount: paymentData.amount,
			tx_ref: paymentData.tx_ref,
			callback_url: process.env.CHAPA_CALLBACK_URL,
			return_url: `${process.env.CLIENT_URL}/purchase-success?tx_ref=${paymentData.tx_ref}&status=success`
		};

		console.log('Sending to Chapa:', chapaPayload);

		const response = await chapa.initialize(chapaPayload);
		return response;
	} catch (error) {
		console.error('Chapa initialization error:', {
			message: error.message,
			status: error.status,
			response: error.response?.data || error.response,
			errorString: JSON.stringify(error, null, 2)
		});
		
		// Try to extract meaningful error message
		let errorMessage = 'Payment initialization failed';
		if (error.response?.data?.message) {
			errorMessage = error.response.data.message;
		} else if (error.message && error.message !== '[object Object]') {
			errorMessage = error.message;
		} else if (error.status === 400) {
			errorMessage = 'Invalid payment data. Please check phone number format.';
		}
		
		throw new Error(errorMessage);
	}
};

// Verify payment
export const verifyPayment = async (tx_ref) => {
	try {
		const response = await chapa.verify({ tx_ref });
		return response;
	} catch (error) {
		console.error('Chapa verification error:', {
			message: error.message,
			status: error.status,
			response: error.response?.data || error.response,
			fullError: error
		});
		throw new Error(`Chapa verification failed: ${error.message || 'Unknown error'}`);
	}
};