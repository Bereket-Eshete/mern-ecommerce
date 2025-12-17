import { ArrowRight, CheckCircle, HandHeart, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";
import Confetti from "react-confetti";

const PurchaseSuccessPage = () => {
	const [isProcessing, setIsProcessing] = useState(true);
	const { clearCart } = useCartStore();
	const [error, setError] = useState(null);

	useEffect(() => {
		const handleCheckoutSuccess = async (tx_ref) => {
			try {
				const response = await axios.post("/payments/checkout-success", {
					tx_ref,
				});
				if (response.data.success) {
					clearCart();
				} else {
					setError("Payment verification failed");
				}
			} catch (error) {
				console.log(error);
				setError(error.response?.data?.message || "Payment verification failed");
			} finally {
				setIsProcessing(false);
			}
		};

		// Get tx_ref from URL parameters (Chapa returns this)
		const urlParams = new URLSearchParams(window.location.search);
		console.log('All URL params:', Object.fromEntries(urlParams));
		console.log('Full URL:', window.location.href);
		
		// Try different parameter names that Chapa might use
		const tx_ref = urlParams.get("trx_ref") || urlParams.get("tx_ref") || urlParams.get("transaction_ref");
		const status = urlParams.get("status") || urlParams.get("payment_status");
		
		console.log('Extracted:', { tx_ref, status });
		
		if (tx_ref && (status === "success" || status === "successful")) {
			handleCheckoutSuccess(tx_ref);
		} else if (status === "failed" || status === "cancelled" || status === "canceled") {
			setIsProcessing(false);
			setError("Payment was cancelled or failed");
		} else if (tx_ref && !status) {
			// Sometimes Chapa only sends tx_ref, verify payment
			handleCheckoutSuccess(tx_ref);
		} else {
			// No valid payment parameters - redirect to home
			console.log('No payment parameters found, redirecting to home');
			setIsProcessing(false);
			setError("No payment information found. Please complete a purchase first.");
		}
	}, [clearCart]);

	if (isProcessing) return (
		<div className='h-screen flex items-center justify-center px-4'>
			<div className='text-center'>
				<Loader className='h-12 w-12 text-emerald-400 animate-spin mx-auto mb-4' />
				<p className='text-gray-300 text-lg'>Processing your payment...</p>
				<p className='text-gray-400 text-sm mt-2'>Please wait while we verify your transaction</p>
			</div>
		</div>
	);

	if (error) return (
		<div className='h-screen flex items-center justify-center px-4'>
			<div className='text-center'>
				<p className='text-red-400 text-lg'>Error: {error}</p>
			</div>
		</div>
	);

	return (
		<div className='h-screen flex items-center justify-center px-4'>
			<Confetti
				width={window.innerWidth}
				height={window.innerHeight}
				gravity={0.1}
				style={{ zIndex: 99 }}
				numberOfPieces={700}
				recycle={false}
			/>

			<div className='max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10'>
				<div className='p-6 sm:p-8'>
					<div className='flex justify-center'>
						<CheckCircle className='text-emerald-400 w-16 h-16 mb-4' />
					</div>
					<h1 className='text-2xl sm:text-3xl font-bold text-center text-emerald-400 mb-2'>
						Purchase Successful!
					</h1>

					<p className='text-gray-300 text-center mb-2'>
						Thank you for your order. {"We're"} processing it now.
					</p>
					<p className='text-emerald-400 text-center text-sm mb-6'>
						Check your email for order details and updates.
					</p>
					<div className='bg-gray-700 rounded-lg p-4 mb-6'>
						<div className='flex items-center justify-between mb-2'>
							<span className='text-sm text-gray-400'>Order number</span>
							<span className='text-sm font-semibold text-emerald-400'>#12345</span>
						</div>
						<div className='flex items-center justify-between'>
							<span className='text-sm text-gray-400'>Estimated delivery</span>
							<span className='text-sm font-semibold text-emerald-400'>3-5 business days</span>
						</div>
					</div>

					<div className='space-y-4'>
						<button
							className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4
             rounded-lg transition duration-300 flex items-center justify-center'
						>
							<HandHeart className='mr-2' size={18} />
							Thanks for trusting us!
						</button>
						<Link
							to={"/"}
							className='w-full bg-gray-700 hover:bg-gray-600 text-emerald-400 font-bold py-2 px-4 
            rounded-lg transition duration-300 flex items-center justify-center'
						>
							Continue Shopping
							<ArrowRight className='ml-2' size={18} />
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
export default PurchaseSuccessPage;
