import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, CreditCard, Loader } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const CheckoutForm = ({ onClose, total, coupon }) => {
	const [customerInfo, setCustomerInfo] = useState({
		first_name: "",
		last_name: "",
		email: "",
		phone_number: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const { cart, clearCart } = useCartStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await axios.post("/payments/create-checkout-session", {
				products: cart,
				couponCode: coupon ? coupon.code : null,
				customerInfo: customerInfo,
			});

			// Redirect to Chapa payment page
			window.location.href = response.data.checkout_url;
		} catch (error) {
			console.error("Checkout error:", error);
			toast.error(error.response?.data?.message || "Checkout failed");
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (e) => {
		setCustomerInfo({
			...customerInfo,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<motion.div
				className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.9 }}
			>
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-emerald-400">Checkout</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-white text-2xl"
					>
						×
					</button>
				</div>

				<div className="mb-4 p-4 bg-gray-700 rounded-lg">
					<p className="text-gray-300">Total Amount:</p>
					<p className="text-2xl font-bold text-emerald-400">{total.toFixed(2)} ETB</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-1">
								First Name
							</label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
								<input
									type="text"
									name="first_name"
									required
									value={customerInfo.first_name}
									onChange={handleInputChange}
									className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
									placeholder="John"
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-300 mb-1">
								Last Name
							</label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
								<input
									type="text"
									name="last_name"
									required
									value={customerInfo.last_name}
									onChange={handleInputChange}
									className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
									placeholder="Doe"
								/>
							</div>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-300 mb-1">
							Email Address
						</label>
						<div className="relative">
							<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
							<input
								type="email"
								name="email"
								required
								value={customerInfo.email}
								onChange={handleInputChange}
								className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
								placeholder="john@example.com"
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-300 mb-1">
							Phone Number
						</label>
						<div className="relative">
							<Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
							<input
								type="tel"
								name="phone_number"
								required
								value={customerInfo.phone_number}
								onChange={handleInputChange}
								className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
								placeholder="0911234567"
							/>
						</div>
					</div>

					<div className="pt-4">
						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-emerald-600 text-white py-3 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
						>
							{isLoading ? (
								<>
									<Loader className="animate-spin h-5 w-5 mr-2" />
									Processing...
								</>
							) : (
								<>
									<CreditCard className="h-5 w-5 mr-2" />
									Pay with Chapa
								</>
							)}
						</button>
					</div>
				</form>

				<div className="mt-4 text-center">
					<p className="text-xs text-gray-400">
						Secure payment powered by Chapa
					</p>
				</div>
			</motion.div>
		</div>
	);
};

export default CheckoutForm;