import { useEffect } from "react";
import { Loader } from "lucide-react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
	{ href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
	{ href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
	{ href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
	{ href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
	{ href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
	{ href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
	{ href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
];

const HomePage = () => {
	const { fetchFeaturedProducts, products, loading } = useProductStore();

	useEffect(() => {
		fetchFeaturedProducts();
	}, [fetchFeaturedProducts]);

	return (
		<div className='relative min-h-screen text-white overflow-hidden'>
			<div className='relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16'>
				<h1 className='text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-emerald-400 mb-3 sm:mb-4'>
					Explore Our Categories
				</h1>
				<p className='text-center text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-10 md:mb-12 px-4'>
					Discover the latest trends in eco-friendly fashion
				</p>

				<div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>

				{loading ? (
					<div className='flex flex-col items-center justify-center py-16'>
						<Loader className='h-12 w-12 text-emerald-400 animate-spin mb-4' />
						<p className='text-gray-300 text-lg'>Loading featured products...</p>
					</div>
				) : (
					products.length > 0 && <FeaturedProducts featuredProducts={products} />
				)}
			</div>
		</div>
	);
};
export default HomePage;
