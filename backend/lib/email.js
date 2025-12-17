import SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from 'dotenv';

dotenv.config();

let apiInstance = null;

if (process.env.BREVO_API_KEY) {
	const defaultClient = SibApiV3Sdk.ApiClient.instance;
	const apiKey = defaultClient.authentications['api-key'];
	apiKey.apiKey = process.env.BREVO_API_KEY;
	apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
	console.log('Brevo email service initialized successfully');
} else {
	console.warn('Brevo API key not configured. Email functionality will be disabled.');
}

export const sendVerificationEmail = async (email, name, verificationToken) => {
	if (!apiInstance) {
		console.error('Brevo API not initialized. Cannot send verification email.');
		throw new Error('Email service is not configured.');
	}

	try {
		const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
		
		sendSmtpEmail.subject = "Verify Your Email - Ecommerce Store";
		sendSmtpEmail.htmlContent = `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
				<h2 style="color: #333;">Welcome to Our Ecommerce Store!</h2>
				<p>Hi ${name},</p>
				<p>Thank you for signing up! Please verify your email address using the code below:</p>
				<div style="text-align: center; margin: 30px 0;">
					<div style="background-color: #f8f9fa; border: 2px dashed #007bff; padding: 20px; border-radius: 10px; display: inline-block;">
						<h1 style="color: #007bff; margin: 0; font-size: 32px; letter-spacing: 5px;">${verificationToken}</h1>
					</div>
				</div>
				<p>Enter this 6-digit code in the verification page to complete your registration.</p>
				<p>This code will expire in 10 minutes.</p>
				<p>Best regards,<br>Ecommerce Store Team</p>
			</div>
		`;
		sendSmtpEmail.sender = {"name": process.env.BREVO_FROM_NAME || "Ecommerce", "email": process.env.BREVO_FROM_EMAIL};
		sendSmtpEmail.to = [{"email": email, "name": name}];

		console.log('Attempting to send verification email to:', email);
		const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
		console.log('Verification email sent successfully to:', email);
		return result;
	} catch (error) {
		console.error('Error sending verification email to:', email);
		console.error('Error details:', error.response?.body || error.message || error);
		throw new Error('Failed to send verification email');
	}
};

export const sendPasswordResetEmail = async (email, name, resetToken) => {
	if (!apiInstance) {
		console.error('Brevo API not initialized. Cannot send password reset email.');
		throw new Error('Email service is not configured.');
	}

	try {
		const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
		
		sendSmtpEmail.subject = "Reset Your Password - Ecommerce Store";
		sendSmtpEmail.htmlContent = `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
				<h2 style="color: #333;">Password Reset Request</h2>
				<p>Hi ${name},</p>
				<p>You requested to reset your password. Use the code below to reset your password:</p>
				<div style="text-align: center; margin: 30px 0;">
					<div style="background-color: #f8f9fa; border: 2px dashed #dc3545; padding: 20px; border-radius: 10px; display: inline-block;">
						<h1 style="color: #dc3545; margin: 0; font-size: 32px; letter-spacing: 5px;">${resetToken}</h1>
					</div>
				</div>
				<p>Enter this 6-digit code in the password reset page.</p>
				<p>This code will expire in 10 minutes.</p>
				<p>If you didn't request this, please ignore this email.</p>
				<p>Best regards,<br>Ecommerce Store Team</p>
			</div>
		`;
		sendSmtpEmail.sender = {"name": process.env.BREVO_FROM_NAME || "Ecommerce", "email": process.env.BREVO_FROM_EMAIL};
		sendSmtpEmail.to = [{"email": email, "name": name}];

		console.log('Attempting to send password reset email to:', email);
		const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
		console.log('Password reset email sent successfully to:', email);
		return result;
	} catch (error) {
		console.error('Error sending password reset email to:', email);
		console.error('Error details:', error.response?.body || error.message || error);
		throw new Error('Failed to send password reset email');
	}
};

export const sendPaymentConfirmationEmail = async (email, name, order, receiptUrl) => {
	if (!apiInstance) {
		console.error('Brevo API not initialized. Cannot send payment confirmation email.');
		return;
	}

	try {
		const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
		
		sendSmtpEmail.subject = "Payment Confirmation - Order #" + order._id.toString().slice(-6);
		sendSmtpEmail.htmlContent = `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
				<h2 style="color: #10b981;">Payment Successful!</h2>
				<p>Hi ${name},</p>
				<p>Thank you for your purchase! Your payment has been successfully processed.</p>
				
				<div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
					<h3 style="color: #374151; margin-top: 0;">Order Details</h3>
					<p><strong>Order ID:</strong> #${order._id.toString().slice(-6)}</p>
					<p><strong>Transaction Reference:</strong> ${order.tx_ref}</p>
					<p><strong>Total Amount:</strong> ${order.totalAmount} ETB</p>
					<p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
				</div>
				
				<div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
					<h3 style="color: #374151; margin-top: 0;">Items Ordered</h3>
					${order.products.map(item => `
						<div style="border-bottom: 1px solid #e5e7eb; padding: 10px 0;">
							<p style="margin: 5px 0;"><strong>${item.product.name}</strong></p>
							<p style="margin: 5px 0; color: #6b7280;">Quantity: ${item.quantity} × ${item.price} ETB</p>
						</div>
					`).join('')}
				</div>
				
				${receiptUrl ? `<p><a href="${receiptUrl}" style="color: #10b981; text-decoration: none;">View Receipt</a></p>` : ''}
				
				<p>Your order is being processed and you'll receive updates via email.</p>
				<p>Best regards,<br>Ecommerce Store Team</p>
			</div>
		`;
		sendSmtpEmail.sender = {"name": process.env.BREVO_FROM_NAME || "Ecommerce", "email": process.env.BREVO_FROM_EMAIL};
		sendSmtpEmail.to = [{"email": email, "name": name}];

		const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
		console.log('Payment confirmation email sent successfully to:', email);
		return result;
	} catch (error) {
		console.error('Error sending payment confirmation email:', error);
	}
};