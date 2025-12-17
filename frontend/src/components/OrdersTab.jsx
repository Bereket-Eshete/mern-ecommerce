import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";

const OrdersTab = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		try {
			const response = await axios.get("/admin/orders");
			setOrders(response.data);
		} catch (error) {
			console.error("Error fetching orders:", error);
		} finally {
			setLoading(false);
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 'completed': return 'bg-emerald-100 text-emerald-800';
			case 'pending': return 'bg-yellow-100 text-yellow-800';
			case 'failed': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	if (loading) return <div className="text-center text-gray-300">Loading orders...</div>;

	return (
		<motion.div
			className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-6xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<table className='min-w-full divide-y divide-gray-700'>
					<thead className='bg-gray-700'>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
								Order ID
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
								Customer
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
								Phone
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
								Items
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
								Total
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
								Status
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
								Date
							</th>
						</tr>
					</thead>
					<tbody className='bg-gray-800 divide-y divide-gray-700'>
						{orders.map((order) => (
							<tr key={order._id} className='hover:bg-gray-700'>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm font-medium text-white'>
										#{order._id?.slice(-6) || 'N/A'}
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm font-medium text-white'>{order.user?.name || 'Unknown User'}</div>
									<div className='text-sm text-gray-400'>{order.user?.email || 'No Email'}</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-300'>{order.user?.phoneNumber || '-'}</div>
								</td>
								<td className='px-6 py-4'>
									<div className='text-sm text-gray-300'>
										{order.products?.length > 0 ? order.products.map((item, index) => (
											<div key={index} className="mb-1">
												{item.product?.name || 'Unknown Product'} x {item.quantity || 0}
											</div>
										)) : <div>No items</div>}
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm font-medium text-emerald-400'>
										{order.totalAmount || 0} ETB
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
										{(order.status || 'unknown').toUpperCase()}
									</span>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-300'>
										{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
		</motion.div>
	);
};

export default OrdersTab;