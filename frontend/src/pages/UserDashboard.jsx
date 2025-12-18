import { User, ShoppingBag, CreditCard, Download, Eye, Edit, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "../lib/axios";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";

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
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [editingProfile, setEditingProfile] = useState(false);
	const [profileData, setProfileData] = useState({});
	const { user } = useUserStore();

	useEffect(() => {
		if (user) {
			setProfileData({
				name: user.name,
				email: user.email,
				phone: user.phoneNumber || "",
				address: user.address || ""
			});
		}
	}, [user]);

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
			toast.error("Failed to fetch orders");
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
			toast.error("Failed to fetch statistics");
		} finally {
			setLoading(false);
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 'completed': return 'text-emerald-400 bg-emerald-400/10';
			case 'pending': return 'text-yellow-400 bg-yellow-400/10';
			case 'failed': return 'text-red-400 bg-red-400/10';
			default: return 'text-gray-400 bg-gray-400/10';
		}
	};

	const generateReceipt = (order) => {
		const receiptContent = `
ECOMMERCE STORE RECEIPT
========================
Order ID: ${order._id}
Date: ${new Date(order.createdAt).toLocaleDateString()}
Status: ${order.status.toUpperCase()}

ITEMS:
${order.products.map(item => 
	`${item.product.name} x${item.quantity} - $${item.price}`
).join('\n')}

TOTAL: $${order.totalAmount}
Payment Status: ${order.paymentStatus}
${order.tx_ref ? `Transaction ID: ${order.tx_ref}` : ''}

Thank you for shopping with us!
		`;
		
		const blob = new Blob([receiptContent], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `receipt-${order._id.slice(-6)}.txt`;
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className='min-h-screen relative overflow-hidden'>
			<div className='relative z-10 container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16'>
				<motion.h1
					className='text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-emerald-400 text-center'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					My Dashboard
				</motion.h1>

				{/* Responsive Tab Navigation */}
				<div className='flex flex-wrap justify-center mb-6 sm:mb-8 gap-2'>
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center px-3 sm:px-4 py-2 rounded-md transition-colors duration-200 text-sm sm:text-base ${
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

				{/* Profile Tab */}
				{activeTab === "profile" && (
					<div className='max-w-2xl mx-auto bg-gray-800 rounded-lg p-4 sm:p-6'>
						<div className='flex justify-between items-center mb-4 sm:mb-6'>
							<h2 className='text-xl sm:text-2xl font-bold text-emerald-400'>Profile Information</h2>
							<button
								onClick={() => setEditingProfile(!editingProfile)}
								className='flex items-center px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm'
							>
								<Edit className='w-4 h-4 mr-1' />
								{editingProfile ? 'Cancel' : 'Edit'}
							</button>
						</div>
						
						<div className='space-y-4'>
							<div>
								<label className='block text-gray-300 mb-2 text-sm sm:text-base'>Name</label>
								{editingProfile ? (
									<input
										type="text"
										value={profileData.name}
										onChange={(e) => setProfileData({...profileData, name: e.target.value})}
										className='w-full bg-gray-700 p-3 rounded-md text-white border border-gray-600 focus:border-emerald-500 focus:outline-none'
									/>
								) : (
									<p className='bg-gray-700 p-3 rounded-md text-white'>{user?.name}</p>
								)}
							</div>
							
							<div>
								<label className='block text-gray-300 mb-2 text-sm sm:text-base'>Email</label>
								<p className='bg-gray-700 p-3 rounded-md text-white'>{user?.email}</p>
							</div>
							
							<div>
								<label className='block text-gray-300 mb-2 text-sm sm:text-base'>Phone</label>
								{editingProfile ? (
									<input
										type="tel"
										value={profileData.phone}
										onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
										className='w-full bg-gray-700 p-3 rounded-md text-white border border-gray-600 focus:border-emerald-500 focus:outline-none'
										placeholder="Enter phone number"
									/>
								) : (
									<p className='bg-gray-700 p-3 rounded-md text-white flex items-center'>
										<Phone className='w-4 h-4 mr-2' />
										{user?.phoneNumber || 'Not provided'}
									</p>
								)}
							</div>
							
							<div>
								<label className='block text-gray-300 mb-2 text-sm sm:text-base'>Address</label>
								{editingProfile ? (
									<textarea
										value={profileData.address}
										onChange={(e) => setProfileData({...profileData, address: e.target.value})}
										className='w-full bg-gray-700 p-3 rounded-md text-white border border-gray-600 focus:border-emerald-500 focus:outline-none'
										rows="3"
										placeholder="Enter your address"
									/>
								) : (
									<p className='bg-gray-700 p-3 rounded-md text-white flex items-start'>
										<MapPin className='w-4 h-4 mr-2 mt-0.5' />
										{user?.address || 'Not provided'}
									</p>
								)}
							</div>
							
							<div>
								<label className='block text-gray-300 mb-2 text-sm sm:text-base'>Role</label>
								<p className='bg-gray-700 p-3 rounded-md text-white capitalize'>{user?.role}</p>
							</div>

							{editingProfile && (
								<button
									onClick={() => {
										// Here you would typically save to backend
										toast.success("Profile updated successfully!");
										setEditingProfile(false);
									}}
									className='w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors'
								>
									Save Changes
								</button>
							)}
						</div>
					</div>
				)}

				{/* Orders Tab */}
				{activeTab === "orders" && (
					<div className='max-w-6xl mx-auto'>
						<h2 className='text-xl sm:text-2xl font-bold text-emerald-400 mb-4 sm:mb-6'>Order History</h2>
						{loading ? (
							<div className='text-center text-gray-300'>Loading orders...</div>
						) : orders.length === 0 ? (
							<div className='text-center text-gray-300 bg-gray-800 rounded-lg p-8'>
								<ShoppingBag className='w-16 h-16 mx-auto mb-4 text-gray-500' />
								<p>No orders found</p>
								<p className='text-sm text-gray-500 mt-2'>Start shopping to see your orders here!</p>
							</div>
						) : (
							<div className='space-y-4'>
								{orders.map((order) => (
									<div key={order._id} className='bg-gray-800 rounded-lg p-4 sm:p-6'>
										<div className='flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3'>
											<div>
												<h3 className='text-lg font-semibold text-white'>
													Order #{order._id.slice(-6)}
												</h3>
												<p className='text-gray-400 text-sm'>
													{new Date(order.createdAt).toLocaleDateString('en-US', {
														year: 'numeric',
														month: 'long',
														day: 'numeric',
														hour: '2-digit',
														minute: '2-digit'
													})}
												</p>
											</div>
											<div className='flex flex-col sm:items-end gap-2'>
												<span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
													{order.status.toUpperCase()}
												</span>
												<p className='text-emerald-400 font-bold text-lg'>
													${order.totalAmount}
												</p>
											</div>
										</div>
										
										<div className='border-t border-gray-700 pt-4 mb-4'>
											<h4 className='text-gray-300 mb-3 font-medium'>Items ({order.products.length}):</h4>
											<div className='space-y-2'>
												{order.products.map((item, index) => (
													<div key={index} className='flex justify-between items-center text-sm'>
														<div className='flex-1'>
															<span className='text-white'>{item.product.name}</span>
															<span className='text-gray-400 ml-2'>x{item.quantity}</span>
														</div>
														<span className='text-emerald-400 font-medium'>${item.price}</span>
													</div>
												))}
											</div>
										</div>

										<div className='flex flex-col sm:flex-row gap-2 sm:gap-3'>
											<button
												onClick={() => setSelectedOrder(order)}
												className='flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm'
											>
												<Eye className='w-4 h-4 mr-2' />
												View Details
											</button>
											<button
												onClick={() => generateReceipt(order)}
												className='flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm'
											>
												<Download className='w-4 h-4 mr-2' />
												Download Receipt
											</button>
										</div>

										{order.tx_ref && (
											<p className='text-xs text-gray-500 mt-3 font-mono'>
												Transaction ID: {order.tx_ref}
											</p>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{/* Statistics Tab */}
				{activeTab === "stats" && (
					<div className='max-w-4xl mx-auto'>
						<h2 className='text-xl sm:text-2xl font-bold text-emerald-400 mb-4 sm:mb-6'>My Statistics</h2>
						{loading ? (
							<div className='text-center text-gray-300'>Loading statistics...</div>
						) : (
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
								<div className='bg-gray-800 rounded-lg p-4 sm:p-6 text-center'>
									<div className='w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3'>
										<ShoppingBag className='w-6 h-6 text-blue-400' />
									</div>
									<h3 className='text-base sm:text-lg font-semibold text-gray-300 mb-2'>Total Orders</h3>
									<p className='text-2xl sm:text-3xl font-bold text-emerald-400'>{stats.totalOrders || 0}</p>
								</div>
								<div className='bg-gray-800 rounded-lg p-4 sm:p-6 text-center'>
									<div className='w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3'>
										<CreditCard className='w-6 h-6 text-emerald-400' />
									</div>
									<h3 className='text-base sm:text-lg font-semibold text-gray-300 mb-2'>Completed Orders</h3>
									<p className='text-2xl sm:text-3xl font-bold text-emerald-400'>{stats.completedOrders || 0}</p>
								</div>
								<div className='bg-gray-800 rounded-lg p-4 sm:p-6 text-center sm:col-span-2 lg:col-span-1'>
									<div className='w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3'>
										<CreditCard className='w-6 h-6 text-yellow-400' />
									</div>
									<h3 className='text-base sm:text-lg font-semibold text-gray-300 mb-2'>Total Spent</h3>
									<p className='text-2xl sm:text-3xl font-bold text-emerald-400'>${stats.totalSpent || 0}</p>
								</div>
							</div>
						)}
					</div>
				)}

				{/* Order Details Modal */}
				{selectedOrder && (
					<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
						<div className='bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
							<div className='flex justify-between items-center mb-6'>
								<h3 className='text-xl font-bold text-emerald-400'>
									Order Details #{selectedOrder._id.slice(-6)}
								</h3>
								<button
									onClick={() => setSelectedOrder(null)}
									className='text-gray-400 hover:text-white text-2xl'
								>
									×
								</button>
							</div>
							
							<div className='space-y-4'>
								<div className='grid grid-cols-2 gap-4 text-sm'>
									<div>
										<span className='text-gray-400'>Order Date:</span>
										<p className='text-white'>{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
									</div>
									<div>
										<span className='text-gray-400'>Status:</span>
										<p className={`font-semibold ${getStatusColor(selectedOrder.status).split(' ')[0]}`}>
											{selectedOrder.status.toUpperCase()}
										</p>
									</div>
									<div>
										<span className='text-gray-400'>Payment Status:</span>
										<p className='text-white capitalize'>{selectedOrder.paymentStatus}</p>
									</div>
									<div>
										<span className='text-gray-400'>Total Amount:</span>
										<p className='text-emerald-400 font-bold'>${selectedOrder.totalAmount}</p>
									</div>
								</div>
								
								<div>
									<h4 className='text-gray-300 font-medium mb-3'>Order Items:</h4>
									<div className='space-y-3'>
										{selectedOrder.products.map((item, index) => (
											<div key={index} className='flex justify-between items-center p-3 bg-gray-700 rounded-md'>
												<div>
													<p className='text-white font-medium'>{item.product.name}</p>
													<p className='text-gray-400 text-sm'>Quantity: {item.quantity}</p>
												</div>
												<p className='text-emerald-400 font-bold'>${item.price}</p>
											</div>
										))}
									</div>
								</div>
								
								{selectedOrder.tx_ref && (
									<div>
										<span className='text-gray-400'>Transaction Reference:</span>
										<p className='text-white font-mono text-sm'>{selectedOrder.tx_ref}</p>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default UserDashboard;