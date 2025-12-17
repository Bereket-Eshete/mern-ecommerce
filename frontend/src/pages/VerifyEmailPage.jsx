import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Mail, Loader } from "lucide-react";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const VerifyEmailPage = () => {
	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = (element, index) => {
		if (isNaN(element.value)) return false;

		setCode([...code.map((d, idx) => (idx === index ? element.value : d))]);

		// Focus next input
		if (element.nextSibling && element.value !== "") {
			element.nextSibling.focus();
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const verificationCode = code.join("");
		
		if (verificationCode.length !== 6) {
			toast.error("Please enter all 6 digits");
			return;
		}

		setLoading(true);
		try {
			const response = await axios.post("/auth/verify-email", { code: verificationCode });
			toast.success(response.data.message);
			navigate("/login");
		} catch (error) {
			toast.error(error.response?.data?.message || "Verification failed");
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
					<Mail className="h-12 w-12 text-emerald-400" />
				</div>
				<h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
					Verify Your Email
				</h2>
				<p className="mt-2 text-center text-sm text-gray-400">
					We've sent a 6-digit code to your email address
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
								Enter verification code
							</label>
							<div className="flex justify-center space-x-2">
								{code.map((data, index) => (
									<input
										key={index}
										type="text"
										maxLength="1"
										value={data}
										onChange={(e) => handleChange(e.target, index)}
										onFocus={(e) => e.target.select()}
										className="w-12 h-12 text-center text-xl font-bold bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white"
									/>
								))}
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
									Verifying...
								</>
							) : (
								<>
									<CheckCircle className="mr-2 h-5 w-5" />
									Verify Email
								</>
							)}
						</button>
					</form>
				</div>
			</motion.div>
		</div>
	);
};

export default VerifyEmailPage;