import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail, sendPasswordResetEmail } from "../lib/email.js";

const generateTokens = (userId) => {
	const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15m",
	});

	const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	});

	return { accessToken, refreshToken };
};

const setCookies = (res, accessToken, refreshToken) => {
	res.cookie("accessToken", accessToken, {
		httpOnly: true, // prevent XSS attacks, cross site scripting attack
		secure: process.env.NODE_ENV === "production",
		sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // allows cross-origin cookies in production
		maxAge: 15 * 60 * 1000, // 15 minutes
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true, // prevent XSS attacks, cross site scripting attack
		secure: process.env.NODE_ENV === "production",
		sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // allows cross-origin cookies in production
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});
};

export const signup = async (req, res) => {
	const { email, password, name, phoneNumber } = req.body;
	try {
		if (!phoneNumber) {
			return res.status(400).json({ message: "Phone number is required" });
		}
		const userExists = await User.findOne({ email });

		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}
		// Generate 6-digit verification code
		const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
		const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

		const user = await User.create({ 
			name, 
			email, 
			phoneNumber,
			password,
			verificationCode: verificationCode,
			verificationCodeExpiresAt: verificationExpires
		});

		// Send verification email
		await sendVerificationEmail(email, name, verificationCode);

		// Don't log user in until email is verified
		res.status(201).json({
			message: "Account created successfully! Please check your email to verify your account before logging in.",
			email: user.email,
			isEmailVerified: user.isEmailVerified
		});
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ message: error.message });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (user && (await user.comparePassword(password))) {
			// Check if email is verified (skip for admin users)
			if (!user.isEmailVerified && user.role !== "admin") {
				return res.status(400).json({ 
					message: "Please verify your email before logging in. Check your inbox for the verification link." 
				});
			}

			const { accessToken, refreshToken } = generateTokens(user._id);
			setCookies(res, accessToken, refreshToken);

			res.json({
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				isEmailVerified: user.isEmailVerified
			});
		} else {
			res.status(400).json({ message: "Invalid email or password" });
		}
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ message: error.message });
	}
};

export const logout = async (req, res) => {
	try {
		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");
		res.json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// this will refresh the access token
export const refreshToken = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			return res.status(401).json({ message: "No refresh token provided" });
		}

		const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
		const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 15 * 60 * 1000,
		});

		res.json({ message: "Token refreshed successfully" });
	} catch (error) {
		console.log("Error in refreshToken controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProfile = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const verifyEmail = async (req, res) => {
	try {
		const { code } = req.body;

		if (!code) {
			return res.status(400).json({ message: "Verification code is required" });
		}

		const user = await User.findOne({
			verificationCode: code,
			verificationCodeExpiresAt: { $gt: Date.now() }
		});

		if (!user) {
			return res.status(400).json({ message: "Invalid or expired verification code" });
		}

		user.isEmailVerified = true;
		user.verificationCode = undefined;
		user.verificationCodeExpiresAt = undefined;
		await user.save();

		res.json({ message: "Email verified successfully!" });
	} catch (error) {
		console.log("Error in verifyEmail controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({ message: "Email is required" });
		}

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Generate 6-digit reset code
		const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
		const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

		user.passwordResetToken = resetCode;
		user.passwordResetExpires = resetExpires;
		await user.save();

		// Send reset email
		await sendPasswordResetEmail(email, user.name, resetCode);

		res.json({ message: "Password reset email sent successfully!" });
	} catch (error) {
		console.log("Error in forgotPassword controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { code, password } = req.body;

		if (!code || !password) {
			return res.status(400).json({ message: "Code and new password are required" });
		}

		if (password.length < 6) {
			return res.status(400).json({ message: "Password must be at least 6 characters long" });
		}

		const user = await User.findOne({
			passwordResetToken: code,
			passwordResetExpires: { $gt: Date.now() }
		});

		if (!user) {
			return res.status(400).json({ message: "Invalid or expired reset code" });
		}

		user.password = password;
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save();

		res.json({ message: "Password reset successfully!" });
	} catch (error) {
		console.log("Error in resetPassword controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const resendVerificationEmail = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({ message: "Email is required" });
		}

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (user.isEmailVerified) {
			return res.status(400).json({ message: "Email is already verified" });
		}

		// Generate new verification token
		const verificationToken = crypto.randomBytes(32).toString('hex');
		const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

		user.emailVerificationToken = verificationToken;
		user.emailVerificationExpires = verificationExpires;
		await user.save();

		// Send verification email
		await sendVerificationEmail(email, user.name, verificationToken);

		res.json({ message: "Verification email sent successfully!" });
	} catch (error) {
		console.log("Error in resendVerificationEmail controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// One-time admin creation endpoint
export const setupAdmin = async (req, res) => {
	try {
		// Check if admin already exists
		const existingAdmin = await User.findOne({ role: "admin" });
		if (existingAdmin) {
			return res.status(400).json({ message: "Admin already exists" });
		}

		const admin = await User.create({
			name: "Bereket",
			email: "bereketeshete89@gmail.com",
			password: "admin123",
			role: "admin",
			isEmailVerified: true
		});

		res.json({ 
			message: "Admin created successfully!",
			email: admin.email,
			role: admin.role
		});
	} catch (error) {
		console.log("Error in setupAdmin controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Create admin user (for development/setup)
export const createAdmin = async (req, res) => {
	try {
		const { email, password, name, adminSecret } = req.body;

		// Simple admin secret check (you can make this more secure)
		if (adminSecret !== "admin123") {
			return res.status(403).json({ message: "Invalid admin secret" });
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		const admin = await User.create({
			name,
			email,
			password,
			role: "admin",
			isEmailVerified: true // Auto-verify admin
		});

		res.status(201).json({
			message: "Admin created successfully",
			admin: {
				id: admin._id,
				name: admin.name,
				email: admin.email,
				role: admin.role
			}
		});
	} catch (error) {
		console.log("Error in createAdmin controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
