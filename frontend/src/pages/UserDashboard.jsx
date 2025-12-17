import { User, ShoppingBag, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "../lib/axios";
import { useAuthStore } from "../stores/useAuthStore";

const tabs = [
	{ id: "profile", label: "Profile", icon: User },
	{ id: "orders", label: "My Orders", icon: ShoppingBag },
	{ id: "stats", label: "Statistics", icon: CreditCard },
];

const UserDashboard = () => {
	const [activeTab, setActiveTab] = useState("profile");
	const [orders, setOrders] = useState([]);
	const [stats, setStats] = useState({});
	const [loading, setLoading] = useState(false);
	const { user } = useAuthStore();

	useEffect(() => {
		if (activeTab === "orders") {
			fetchOrders();
		} else if (activeTab === "stats") {
			fetchStats();
		}
	}, [activeTab]);

	const fetchOrders = async () => {
		setLoading(true);
		try {
			const response = await axios.get("/user/orders");
			setOrders(response.data);
		} catch (error) {
			console.error("Error fetching orders:", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchStats = async () => {
		setLoading(true);
		try {
			const response = await axios.get("/user/stats");
			setStats(response.data);
		} catch (error) {
			console.error("Error fetching stats:", error);
		} finally {
			setLoading(false);
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 'completed': return 'text-emerald-400';
			case 'pending': return 'text-yellow-400';
			case 'failed': return 'text-red-400';
			default: return 'text-gray-400';
		}
	};

	return (
		<div className='min-h-screen relative overflow-hidden'>
			<div className='relative z-10 container mx-auto px-4 py-16'>
				<motion.h1
					className='text-4xl font-bold mb-8 text-emerald-400 text-center'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					My Dashboard
				</motion.h1>

				<div className='flex justify-center mb-8'>
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
								activeTab === tab.id
									? "bg-emerald-600 text-white"
									: "bg-gray-700 text-gray-300 hover:bg-gray-600"
							}`}
						>
							<tab.icon className='mr-2 h-5 w-5' />
							{tab.label}
						</button>
					))}
				</div>

				{activeTab === "profile" && (
					<div className='max-w-2xl mx-auto bg-gray-800 rounded-lg p-6'>
						<h2 className='text-2xl font-bold text-emerald-400 mb-4'>Profile Information</h2>
						<div className='space-y-4'>
							<div>
								<label className='block text-gray-300 mb-2'>Name</label>
								<p className='bg-gray-700 p-3 rounded-md text-white'>{user?.name}</p>
							</div>
							<div>
								<label className='block text-gray-300 mb-2'>Email</label>
								<p className='bg-gray-700 p-3 rounded-md text-white'>{user?.email}</p>
							</div>
							<div>
								<label className='block text-gray-300 mb-2'>Role</label>
								<p className='bg-gray-700 p-3 rounded-md text-white capitalize'>{user?.role}</p>
							</div>
						</div>
					</div>
				)}

				{activeTab === "orders" && (
					<div className='max-w-6xl mx-auto'>
						<h2 className='text-2xl font-bold text-emerald-400 mb-6'>Order History</h2>
						{loading ? (
							<div className='text-center text-gray-300'>Loading orders...</div>
						) : orders.length === 0 ? (
							<div className='text-center text-gray-300'>No orders found</div>
						) : (
							<div className='space-y-4'>
								{orders.map((order) => (
									<div key={order._id} className='bg-gray-800 rounded-lg p-6'>
										<div className='flex justify-between items-start mb-4'>
											<div>
												<h3 className='text-lg font-semibold text-white'>
													Order #{order._id.slice(-6)}
												</h3>
												<p className='text-gray-400'>
													{new Date(order.createdAt).toLocaleDateString()}
												</p>
											</div>
											<div className='text-right'>
												<p className={`font-semibold ${getStatusColor(order.status)}`}>
													{order.status.toUpperCase()}
												</p>
												<p className='text-emerald-400 font-bold'>
													{order.totalAmount} ETB
												</p>
											</div>
										</div>
										<div className='border-t border-gray-700 pt-4'>
											<h4 className='text-gray-300 mb-2'>Items:</h4>
											{order.products.map((item, index) => (
												<div key={index} className='flex justify-between text-sm text-gray-400 mb-1'>
													<span>{item.product.name} x {item.quantity}</span>
													<span>{item.price} ETB</span>
												</div>
											))}
										</div>
										{order.tx_ref && (
											<p className='text-xs text-gray-500 mt-2'>
												Transaction: {order.tx_ref}
											</p>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{activeTab === "stats" && (
					<div className='max-w-4xl mx-auto'>
						<h2 className='text-2xl font-bold text-emerald-400 mb-6'>My Statistics</h2>
						{loading ? (
							<div className='text-center text-gray-300'>Loading statistics...</div>
						) : (
							<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
								<div className='bg-gray-800 rounded-lg p-6 text-center'>
									<h3 className='text-lg font-semibold text-gray-300 mb-2'>Total Orders</h3>
									<p className='text-3xl font-bold text-emerald-400'>{stats.totalOrders || 0}</p>
								</div>
								<div className='bg-gray-800 rounded-lg p-6 text-center'>
									<h3 className='text-lg font-semibold text-gray-300 mb-2'>Completed Orders</h3>
									<p className='text-3xl font-bold text-emerald-400'>{stats.completedOrders || 0}</p>
								</div>
								<div className='bg-gray-800 rounded-lg p-6 text-center'>
									<h3 className='text-lg font-semibold text-gray-300 mb-2'>Total Spent</h3>
									<p className='text-3xl font-bold text-emerald-400'>{stats.totalSpent || 0} ETB</p>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default UserDashboard;