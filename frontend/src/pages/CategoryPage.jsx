import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader, ShoppingBag } from "lucide-react";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
	const { fetchProductsByCategory, products, loading } = useProductStore();

	const { category } = useParams();

	useEffect(() => {
		fetchProductsByCategory(category);
	}, [fetchProductsByCategory, category]);

	return (
		<div className='min-h-screen'>
			<div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<motion.h1
					className='text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					{category.charAt(0).toUpperCase() + category.slice(1)}
				</motion.h1>

				{loading ? (
					<motion.div
						className='flex flex-col items-center justify-center py-16'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
					>
						<Loader className='h-12 w-12 text-emerald-400 animate-spin mb-4' />
						<p className='text-gray-300 text-lg'>Loading products...</p>
					</motion.div>
				) : (
					<motion.div
						className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
					>
						{products?.length === 0 ? (
							<div className='col-span-full flex flex-col items-center justify-center py-16'>
								<ShoppingBag className='h-16 w-16 text-gray-400 mb-4' />
								<h2 className='text-2xl font-semibold text-gray-300 mb-2'>
									No products found in {category}
								</h2>
								<p className='text-gray-400 text-center max-w-md'>
									We're working on adding more products to this category. Check back soon!
								</p>
							</div>
						) : (
							products?.map((product) => (
								<ProductCard key={product._id} product={product} />
							))
						)}
					</motion.div>
				)}
			</div>
		</div>
	);
};
export default CategoryPage;
