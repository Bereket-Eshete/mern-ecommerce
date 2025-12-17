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
				<p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
				<div style="text-align: center; margin: 30px 0;">
					<a href="${process.env.CLIENT_URL}/verify-email?token=${verificationToken}" 
					   style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
						Verify Email
					</a>
				</div>
				<p>If the button doesn't work, copy and paste this link into your browser:</p>
				<p>${process.env.CLIENT_URL}/verify-email?token=${verificationToken}</p>
				<p>This link will expire in 24 hours.</p>
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
				<p>You requested to reset your password. Click the button below to set a new password:</p>
				<div style="text-align: center; margin: 30px 0;">
					<a href="${process.env.CLIENT_URL}/reset-password?token=${resetToken}" 
					   style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
						Reset Password
					</a>
				</div>
				<p>If the button doesn't work, copy and paste this link into your browser:</p>
				<p>${process.env.CLIENT_URL}/reset-password?token=${resetToken}</p>
				<p>This link will expire in 1 hour.</p>
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