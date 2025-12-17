import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";

const UsersTab = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			const response = await axios.get("/admin/users");
			setUsers(response.data);
		} catch (error) {
			console.error("Error fetching users:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <div className="text-center text-gray-300">Loading users...</div>;

	return (
		<motion.div
			className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<table className='min-w-full divide-y divide-gray-700'>
					<thead className='bg-gray-700'>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
								Name
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
								Email
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
								Phone
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
								Joined
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
								Status
							</th>
						</tr>
					</thead>
					<tbody className='bg-gray-800 divide-y divide-gray-700'>
						{users.map((user) => (
							<tr key={user._id} className='hover:bg-gray-700'>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm font-medium text-white'>{user.name}</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-300'>{user.email}</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-300'>{user.phoneNumber || '-'}</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-300'>
										{new Date(user.createdAt).toLocaleDateString()}
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<span className={`px-2 py-1 text-xs rounded-full ${
										user.isEmailVerified 
											? 'bg-emerald-100 text-emerald-800' 
											: 'bg-yellow-100 text-yellow-800'
									}`}>
										{user.isEmailVerified ? 'Verified' : 'Pending'}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
		</motion.div>
	);
};

export default UsersTab;