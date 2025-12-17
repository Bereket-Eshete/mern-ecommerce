import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, Receipt, Loader } from "lucide-react";
import { motion } from "framer-motion";

const ChapaReceiptPage = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [countdown, setCountdown] = useState(5);

	useEffect(() => {
		// Start countdown
		const timer = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					// Get tx_ref from URL and redirect to success page
					const tx_ref = searchParams.get("tx_ref");
					navigate(`/purchase-success?tx_ref=${tx_ref}&status=success`);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [searchParams, navigate]);

	return (
		<div className='flex flex-col justify-center items-center min-h-screen py-12 px-4'>
			<motion.div
				className='max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 text-center'
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
			>
				<div className="mb-6">
					<Receipt className="mx-auto h-16 w-16 text-emerald-400 mb-4" />
					<CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
				</div>

				<h1 className='text-2xl font-bold text-emerald-400 mb-4'>
					Payment Successful!
				</h1>

				<p className='text-gray-300 mb-6'>
					Your payment has been processed successfully through Chapa.
					Please keep your receipt for your records.
				</p>

				<div className="bg-gray-700 rounded-lg p-4 mb-6">
					<p className="text-gray-300 text-sm">
						Transaction Reference:
					</p>
					<p className="text-emerald-400 font-mono text-lg">
						{searchParams.get("tx_ref") || "Processing..."}
					</p>
				</div>

				<div className="flex items-center justify-center space-x-2 mb-4">
					<Loader className="h-5 w-5 text-emerald-400 animate-spin" />
					<p className='text-gray-300'>
						Redirecting in {countdown} seconds...
					</p>
				</div>

				<button
					onClick={() => {
						const tx_ref = searchParams.get("tx_ref");
						navigate(`/purchase-success?tx_ref=${tx_ref}&status=success`);
					}}
					className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition duration-200"
				>
					Continue Now
				</button>
			</motion.div>
		</div>
	);
};

export default ChapaReceiptPage;