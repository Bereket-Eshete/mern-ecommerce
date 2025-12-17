import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Loader, CheckCircle } from "lucide-react";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleCodeChange = (element, index) => {
		if (isNaN(element.value)) return false;

		setCode([...code.map((d, idx) => (idx === index ? element.value : d))]);

		if (element.nextSibling && element.value !== "") {
			element.nextSibling.focus();
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const resetCode = code.join("");
		
		if (resetCode.length !== 6) {
			toast.error("Please enter all 6 digits");
			return;
		}

		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		if (password.length < 6) {
			toast.error("Password must be at least 6 characters long");
			return;
		}

		setLoading(true);
		try {
			const response = await axios.post("/auth/reset-password", { 
				code: resetCode, 
				password 
			});
			toast.success(response.data.message);
			navigate("/login");
		} catch (error) {
			toast.error(error.response?.data?.message || "Password reset failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<motion.div
				className="sm:mx-auto sm:w-full sm:max-w-md"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<div className="flex justify-center">
					<Lock className="h-12 w-12 text-emerald-400" />
				</div>
				<h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
					Reset Your Password
				</h2>
				<p className="mt-2 text-center text-sm text-gray-400">
					Enter the 6-digit code sent to your email and your new password
				</p>
			</motion.div>

			<motion.div
				className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.2 }}
			>
				<div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-gray-300 text-center mb-4">
								Enter reset code
							</label>
							<div className="flex justify-center space-x-2 mb-6">
								{code.map((data, index) => (
									<input
										key={index}
										type="text"
										maxLength="1"
										value={data}
										onChange={(e) => handleCodeChange(e.target, index)}
										onFocus={(e) => e.target.select()}
										className="w-12 h-12 text-center text-xl font-bold bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white"
									/>
								))}
							</div>
						</div>

						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-300">
								New Password
							</label>
							<div className="mt-1 relative rounded-md shadow-sm">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="h-5 w-5 text-gray-400" />
								</div>
								<input
									id="password"
									type="password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-white"
									placeholder="••••••••"
								/>
							</div>
						</div>

						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
								Confirm New Password
							</label>
							<div className="mt-1 relative rounded-md shadow-sm">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="h-5 w-5 text-gray-400" />
								</div>
								<input
									id="confirmPassword"
									type="password"
									required
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-white"
									placeholder="••••••••"
								/>
							</div>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
						>
							{loading ? (
								<>
									<Loader className="mr-2 h-5 w-5 animate-spin" />
									Resetting...
								</>
							) : (
								<>
									<CheckCircle className="mr-2 h-5 w-5" />
									Reset Password
								</>
							)}
						</button>
					</form>
				</div>
			</motion.div>
		</div>
	);
};

export default ResetPasswordPage;