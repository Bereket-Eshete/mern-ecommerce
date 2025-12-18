import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageCircle, Shield, Truck, CreditCard, Headphones } from "lucide-react";
import toast from "react-hot-toast";

const features = [
	{ icon: Shield, title: "Secure Shopping", description: "Your data is protected" },
	{ icon: Truck, title: "Fast Delivery", description: "Quick & reliable shipping" },
	{ icon: CreditCard, title: "Easy Payments", description: "Multiple payment options" },
	{ icon: Headphones, title: "24/7 Support", description: "Always here to help" }
];

const ContactPage = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: ""
	});
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({});

	const validateForm = () => {
		const newErrors = {};
		
		if (!formData.name.trim()) newErrors.name = "Name is required";
		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}
		if (!formData.subject.trim()) newErrors.subject = "Subject is required";
		if (!formData.message.trim()) newErrors.message = "Message is required";
		
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (!validateForm()) {
			toast.error("Please fix the errors below");
			return;
		}
		
		setLoading(true);
		
		setTimeout(() => {
			toast.success("🎉 Message sent successfully! We'll get back to you within 24 hours.");
			setFormData({ name: "", email: "", subject: "", message: "" });
			setErrors({});
			setLoading(false);
		}, 1500);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		
		if (errors[name]) {
			setErrors({ ...errors, [name]: "" });
		}
	};

	return (
		<div className="min-h-screen relative overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
				{/* Header */}
				<motion.div
					className="text-center mb-12 sm:mb-16"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-400 mb-4 sm:mb-6">
						Contact Us
					</h1>
					<p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
						Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
					{/* Contact Form */}
					<motion.div
						className="bg-gray-800 rounded-lg p-6 sm:p-8"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
					>
						<div className="flex items-center mb-6">
							<MessageCircle className="h-6 w-6 text-emerald-400 mr-3" />
							<h2 className="text-xl sm:text-2xl font-bold text-white">Send us a Message</h2>
						</div>
						
						<form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
										Full Name
									</label>
									<input
										type="text"
										id="name"
										name="name"
										value={formData.name}
										onChange={handleChange}
										className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.name ? 'border-red-500' : 'border-gray-600'}`}
										required
									/>
									{errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
								</div>
								<div>
									<label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
										Email Address
									</label>
									<input
										type="email"
										id="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.email ? 'border-red-500' : 'border-gray-600'}`}
										required
									/>
									{errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
								</div>
							</div>
							
							<div>
								<label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
									Subject
								</label>
								<input
									type="text"
									id="subject"
									name="subject"
									value={formData.subject}
									onChange={handleChange}
									className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.subject ? 'border-red-500' : 'border-gray-600'}`}
									required
								/>
								{errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
							</div>
							
							<div>
								<label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
									Message
								</label>
								<textarea
									id="message"
									name="message"
									value={formData.message}
									onChange={handleChange}
									rows="5"
									className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.message ? 'border-red-500' : 'border-gray-600'}`}
									required
								/>
								{errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
							</div>
							
							<button
								type="submit"
								disabled={loading}
								className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
							>
								{loading ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
										Sending...
									</>
								) : (
									<>
										<Send className="h-4 w-4 mr-2" />
										Send Message
									</>
								)}
							</button>
						</form>
					</motion.div>

					{/* Contact Information */}
					<motion.div
						className="space-y-6 sm:space-y-8"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
					>
						<div className="bg-gray-800 rounded-lg p-6 sm:p-8">
							<h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Get in Touch</h2>
							<div className="space-y-4 sm:space-y-6">
								<div className="flex items-start space-x-4">
									<div className="w-10 h-10 bg-emerald-600/20 rounded-full flex items-center justify-center flex-shrink-0">
										<Mail className="h-5 w-5 text-emerald-400" />
									</div>
									<div>
										<h3 className="text-white font-semibold mb-1">Email Us</h3>
										<p className="text-gray-400 text-sm">support@ecommerce.com</p>
										<p className="text-gray-400 text-sm">We'll respond within 24 hours</p>
									</div>
								</div>
								
								<div className="flex items-start space-x-4">
									<div className="w-10 h-10 bg-emerald-600/20 rounded-full flex items-center justify-center flex-shrink-0">
										<Phone className="h-5 w-5 text-emerald-400" />
									</div>
									<div>
										<h3 className="text-white font-semibold mb-1">Call Us</h3>
										<p className="text-gray-400 text-sm">+1 (555) 123-4567</p>
										<p className="text-gray-400 text-sm">Mon-Fri 9AM-6PM EST</p>
									</div>
								</div>
								
								<div className="flex items-start space-x-4">
									<div className="w-10 h-10 bg-emerald-600/20 rounded-full flex items-center justify-center flex-shrink-0">
										<MapPin className="h-5 w-5 text-emerald-400" />
									</div>
									<div>
										<h3 className="text-white font-semibold mb-1">Visit Us</h3>
										<p className="text-gray-400 text-sm">123 Commerce Street</p>
										<p className="text-gray-400 text-sm">New York, NY 10001</p>
									</div>
								</div>
							</div>
						</div>

						{/* Features */}
						<div className="bg-gray-800 rounded-lg p-6 sm:p-8">
							<h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Why Shop With Us</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{features.map((feature, index) => (
									<div key={index} className="flex items-start space-x-3">
										<div className="w-8 h-8 bg-emerald-600/20 rounded-full flex items-center justify-center flex-shrink-0">
											<feature.icon className="h-4 w-4 text-emerald-400" />
										</div>
										<div>
											<h3 className="text-white font-medium text-sm mb-1">{feature.title}</h3>
											<p className="text-gray-400 text-xs">{feature.description}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default ContactPage;