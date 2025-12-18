import { BarChart, PlusCircle, ShoppingBasket, Users, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import UsersTab from "../components/UsersTab";
import OrdersTab from "../components/OrdersTab";
import { useProductStore } from "../stores/useProductStore";

const tabs = [
	{ id: "create", label: "Create Product", icon: PlusCircle },
	{ id: "products", label: "Products", icon: ShoppingBasket },
	{ id: "users", label: "Users", icon: Users },
	{ id: "orders", label: "Orders", icon: Package },
	{ id: "analytics", label: "Analytics", icon: BarChart },
];

const AdminPage = () => {
	const [activeTab, setActiveTab] = useState("create");
	const { fetchAllProducts } = useProductStore();

	useEffect(() => {
		fetchAllProducts();
	}, [fetchAllProducts]);

	return (
		<div className='min-h-screen relative overflow-hidden'>
			<div className='relative z-10 container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16'>
				<motion.h1
					className='text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-emerald-400 text-center'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					Admin Dashboard
				</motion.h1>

				{/* Responsive Tab Navigation */}
				<div className='flex flex-wrap justify-center mb-6 sm:mb-8 gap-2'>
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center px-2 sm:px-3 md:px-4 py-2 rounded-md transition-colors duration-200 text-xs sm:text-sm md:text-base ${
								activeTab === tab.id
									? "bg-emerald-600 text-white"
									: "bg-gray-700 text-gray-300 hover:bg-gray-600"
							}`}
						>
							<tab.icon className='mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5' />
							<span className='hidden xs:inline'>{tab.label}</span>
						</button>
					))}
				</div>
				{activeTab === "create" && <CreateProductForm />}
				{activeTab === "products" && <ProductsList />}
				{activeTab === "users" && <UsersTab />}
				{activeTab === "orders" && <OrdersTab />}
				{activeTab === "analytics" && <AnalyticsTab />}
			</div>
		</div>
	);
};
export default AdminPage;
