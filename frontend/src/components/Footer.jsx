import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Github } from "lucide-react";

const Footer = () => {
	return (
		<footer className="bg-gray-900 border-t border-gray-800 mt-16">
			<div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
					{/* Company Info */}
					<div className="space-y-4">
						<h3 className="text-lg font-bold text-emerald-400">E-Commerce Store</h3>
						<p className="text-gray-400 text-sm">
							Your trusted destination for quality products and exceptional service. 
							Shop with confidence and style.
						</p>
						<div className="flex space-x-4">
							<Facebook className="h-5 w-5 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors" />
							<Twitter className="h-5 w-5 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors" />
							<Instagram className="h-5 w-5 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors" />
							<Github className="h-5 w-5 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors" />
						</div>
					</div>

					{/* Quick Links */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-white">Quick Links</h3>
						<div className="space-y-2">
							<Link to="/" className="block text-gray-400 hover:text-emerald-400 transition-colors text-sm">Home</Link>
							<Link to="/about" className="block text-gray-400 hover:text-emerald-400 transition-colors text-sm">About Us</Link>
							<Link to="/contact" className="block text-gray-400 hover:text-emerald-400 transition-colors text-sm">Contact</Link>
							<Link to="/privacy" className="block text-gray-400 hover:text-emerald-400 transition-colors text-sm">Privacy Policy</Link>
						</div>
					</div>

					{/* Categories */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-white">Categories</h3>
						<div className="space-y-2">
							<Link to="/category/t-shirts" className="block text-gray-400 hover:text-emerald-400 transition-colors text-sm">T-Shirts</Link>
							<Link to="/category/shoes" className="block text-gray-400 hover:text-emerald-400 transition-colors text-sm">Shoes</Link>
							<Link to="/category/jackets" className="block text-gray-400 hover:text-emerald-400 transition-colors text-sm">Jackets</Link>
							<Link to="/category/jeans" className="block text-gray-400 hover:text-emerald-400 transition-colors text-sm">Jeans</Link>
						</div>
					</div>

					{/* Contact Info */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-white">Contact Info</h3>
						<div className="space-y-3">
							<div className="flex items-center space-x-3">
								<Mail className="h-4 w-4 text-emerald-400" />
								<span className="text-gray-400 text-sm">support@ecommerce.com</span>
							</div>
							<div className="flex items-center space-x-3">
								<Phone className="h-4 w-4 text-emerald-400" />
								<span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
							</div>
							<div className="flex items-center space-x-3">
								<MapPin className="h-4 w-4 text-emerald-400" />
								<span className="text-gray-400 text-sm">123 Commerce St, City, State</span>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="border-t border-gray-800 mt-8 pt-6 sm:pt-8">
					<div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
						<p className="text-gray-400 text-sm text-center sm:text-left">
							© 2025 E-Commerce Store. All rights reserved.
						</p>
						<div className="flex space-x-6">
							<Link to="/terms" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
								Terms of Service
							</Link>
							<Link to="/privacy" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
								Privacy Policy
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;