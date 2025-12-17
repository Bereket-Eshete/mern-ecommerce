import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { motion } from "framer-motion";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const VerifyEmailPage = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [status, setStatus] = useState("loading");
	const [message, setMessage] = useState("");

	useEffect(() => {
		const verifyEmail = async () => {
			const token = searchParams.get("token");
			
			if (!token) {
				setStatus("error");
				setMessage("No verification token provided");
				return;
			}

			try {
				const response = await axios.get(`/auth/verify-email?token=${token}`);
				setStatus("success");
				setMessage(response.data.message);
				toast.success("Email verified successfully!");
				
				setTimeout(() => {
					navigate("/login");
				}, 3000);
			} catch (error) {
				setStatus("error");
				setMessage(error.response?.data?.message || "Email verification failed");
				toast.error("Email verification failed");
			}
		};

		verifyEmail();
	}, [searchParams, navigate]);

	return (
		<div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
			<motion.div
				className='sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<h2 className='mt-6 text-center text-3xl font-extrabold text-emerald-400'>Email Verification</h2>
			</motion.div>

			<motion.div
				className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.2 }}
			>
				<div className='bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>
					<div className="text-center">
						{status === "loading" && (
							<div className="space-y-4">
								<Loader className="mx-auto h-12 w-12 text-emerald-400 animate-spin" />
								<p className="text-gray-300">Verifying your email...</p>
							</div>
						)}
						
						{status === "success" && (
							<div className="space-y-4">
								<CheckCircle className="mx-auto h-12 w-12 text-emerald-400" />
								<p className="text-emerald-400 font-medium">{message}</p>
								<p className="text-gray-300">Redirecting to login page...</p>
							</div>
						)}
						
						{status === "error" && (
							<div className="space-y-4">
								<XCircle className="mx-auto h-12 w-12 text-red-400" />
								<p className="text-red-400 font-medium">{message}</p>
								<button
									onClick={() => navigate("/login")}
									className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition duration-200"
								>
									Go to Login
								</button>
							</div>
						)}
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default VerifyEmailPage;