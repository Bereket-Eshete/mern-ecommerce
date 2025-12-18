import { motion } from "framer-motion";
import { ShoppingBag, Users, Award, Truck } from "lucide-react";

const AboutPage = () => {
	const features = [
		{
			icon: ShoppingBag,
			title: "Quality Products",
			description: "Carefully curated selection of premium products from trusted brands worldwide."
		},
		{
			icon: Users,
			title: "Customer First",
			description: "Dedicated customer service team available 24/7 to assist with your needs."
		},
		{
			icon: Award,
			title: "Best Prices",
			description: "Competitive pricing with regular discounts and exclusive member offers."
		},
		{
			icon: Truck,
			title: "Fast Delivery",
			description: "Quick and reliable shipping with tracking available for all orders."
		}
	];

	return (
		<div className="min-h-screen relative overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
				{/* Hero Section */}
				<motion.div
					className="text-center mb-12 sm:mb-16"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-400 mb-4 sm:mb-6">
						About Our Store
					</h1>
					<p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
						We're passionate about bringing you the finest selection of products with 
						exceptional quality and unmatched customer service.
					</p>
				</motion.div>

				{/* Story Section */}
				<motion.div
					className="bg-gray-800 rounded-lg p-6 sm:p-8 md:p-10 mb-12 sm:mb-16"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
				>
					<h2 className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-4 sm:mb-6">Our Story</h2>
					<div className="space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
						<p>
							Our e-commerce platform was born from a simple idea: 
							to make quality products accessible to everyone, everywhere. We started 
							as a small team with big dreams and have grown into a trusted destination 
							for thousands of customers worldwide.
						</p>
						<p>
							Our commitment to excellence drives everything we do. From carefully 
							selecting our product range to ensuring seamless shopping experiences, 
							we're dedicated to exceeding your expectations at every step.
						</p>
						<p>
							Today, we're proud to offer a diverse catalog spanning fashion, 
							accessories, and lifestyle products, all backed by our promise of 
							quality, authenticity, and exceptional customer service.
						</p>
					</div>
				</motion.div>

				{/* Features Grid */}
				<motion.div
					className="mb-12 sm:mb-16"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
				>
					<h2 className="text-2xl sm:text-3xl font-bold text-emerald-400 text-center mb-8 sm:mb-12">
						Why Choose Us
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
						{features.map((feature, index) => (
							<div key={index} className="text-center">
								<div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
									<feature.icon className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-400" />
								</div>
								<h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{feature.title}</h3>
								<p className="text-gray-400 text-sm sm:text-base">{feature.description}</p>
							</div>
						))}
					</div>
				</motion.div>

				{/* Mission Section */}
				<motion.div
					className="text-center bg-gray-800 rounded-lg p-6 sm:p-8 md:p-10"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.6 }}
				>
					<h2 className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-4 sm:mb-6">Our Mission</h2>
					<p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
						To revolutionize online shopping by providing an exceptional experience that 
						combines quality products, competitive prices, and outstanding customer service. 
						We believe shopping should be enjoyable, convenient, and trustworthy.
					</p>
				</motion.div>
			</div>
		</div>
	);
};

export default AboutPage;