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