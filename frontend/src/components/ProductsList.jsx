import { motion } from "framer-motion";
import { Trash, Star, Edit } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import { useState } from "react";

const ProductsList = () => {
	const { deleteProduct, toggleFeaturedProduct, updateProduct, products } = useProductStore();
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [productToDelete, setProductToDelete] = useState(null);
	const [showEditModal, setShowEditModal] = useState(false);
	const [productToEdit, setProductToEdit] = useState(null);
	const [editFormData, setEditFormData] = useState({});

	console.log("products", products);

	const handleDeleteClick = (product) => {
		setProductToDelete(product);
		setShowDeleteModal(true);
	};

	const confirmDelete = () => {
		if (productToDelete) {
			deleteProduct(productToDelete._id);
			setShowDeleteModal(false);
			setProductToDelete(null);
		}
	};

	const cancelDelete = () => {
		setShowDeleteModal(false);
		setProductToDelete(null);
	};

	const handleEditClick = (product) => {
		setProductToEdit(product);
		setEditFormData({
			name: product.name,
			description: product.description,
			price: product.price,
			category: product.category,
			image: product.image
		});
		setShowEditModal(true);
	};

	const handleEditSubmit = async (e) => {
		e.preventDefault();
		try {
			await updateProduct(productToEdit._id, editFormData);
			setShowEditModal(false);
			setProductToEdit(null);
			setEditFormData({});
		} catch (error) {
			// Error handled in store
		}
	};

	const cancelEdit = () => {
		setShowEditModal(false);
		setProductToEdit(null);
		setEditFormData({});
	};

	return (
		<motion.div
			className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-7xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			{/* Desktop Table View */}
			<div className='hidden md:block'>
				<table className='min-w-full divide-y divide-gray-700'>
				<thead className='bg-gray-700'>
					<tr>
							<th scope='col' className='px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
								Product
							</th>
							<th scope='col' className='px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
								Price
							</th>
							<th scope='col' className='px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
								Category
							</th>
							<th scope='col' className='px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
								Featured
							</th>
							<th scope='col' className='px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
								Actions
							</th>
					</tr>
				</thead>

				<tbody className='bg-gray-800 divide-y divide-gray-700'>
						{products?.map((product) => (
							<tr key={product._id} className='hover:bg-gray-700'>
								<td className='px-3 lg:px-6 py-4 whitespace-nowrap'>
									<div className='flex items-center'>
										<div className='flex-shrink-0 h-8 w-8 lg:h-10 lg:w-10'>
											<img
												className='h-8 w-8 lg:h-10 lg:w-10 rounded-full object-cover'
												src={product.image}
												alt={product.name}
											/>
										</div>
										<div className='ml-2 lg:ml-4'>
											<div className='text-xs lg:text-sm font-medium text-white truncate max-w-[100px] lg:max-w-none'>{product.name}</div>
										</div>
									</div>
								</td>
								<td className='px-3 lg:px-6 py-4 whitespace-nowrap'>
									<div className='text-xs lg:text-sm text-gray-300'>${product.price.toFixed(2)}</div>
								</td>
								<td className='px-3 lg:px-6 py-4 whitespace-nowrap'>
									<div className='text-xs lg:text-sm text-gray-300 capitalize'>{product.category}</div>
								</td>
								<td className='px-3 lg:px-6 py-4 whitespace-nowrap'>
									<button
										onClick={() => toggleFeaturedProduct(product._id)}
										className={`p-1 rounded-full ${
											product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"
										} hover:bg-yellow-500 transition-colors duration-200`}
									>
										<Star className='h-4 w-4 lg:h-5 lg:w-5' />
									</button>
								</td>
								<td className='px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-medium'>
									<div className='flex space-x-1 lg:space-x-2'>
										<button
											onClick={() => handleEditClick(product)}
											className='text-blue-400 hover:text-blue-300'
											title='Edit Product'
										>
											<Edit className='h-4 w-4 lg:h-5 lg:w-5' />
										</button>
										<button
											onClick={() => handleDeleteClick(product)}
											className='text-red-400 hover:text-red-300'
											title='Delete Product'
										>
											<Trash className='h-4 w-4 lg:h-5 lg:w-5' />
										</button>
									</div>
								</td>
							</tr>
						))}
				</tbody>
				</table>
			</div>

			{/* Mobile Card View */}
			<div className='md:hidden space-y-4 p-4'>
				{products?.map((product) => (
					<div key={product._id} className='bg-gray-700 rounded-lg p-4'>
						<div className='flex items-start space-x-3 mb-3'>
							<img
								className='h-12 w-12 rounded-lg object-cover'
								src={product.image}
								alt={product.name}
							/>
							<div className='flex-1 min-w-0'>
								<h3 className='text-sm font-medium text-white truncate'>{product.name}</h3>
								<p className='text-sm text-emerald-400 font-semibold'>${product.price.toFixed(2)}</p>
								<p className='text-xs text-gray-400 capitalize'>{product.category}</p>
							</div>
							<button
								onClick={() => toggleFeaturedProduct(product._id)}
								className={`p-2 rounded-full ${
									product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"
								} hover:bg-yellow-500 transition-colors duration-200`}
							>
								<Star className='h-4 w-4' />
							</button>
						</div>
						<div className='flex justify-end space-x-2'>
							<button
								onClick={() => handleEditClick(product)}
								className='flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm'
							>
								<Edit className='h-4 w-4 mr-1' />
								Edit
							</button>
							<button
								onClick={() => handleDeleteClick(product)}
								className='flex items-center px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm'
							>
								<Trash className='h-4 w-4 mr-1' />
								Delete
							</button>
						</div>
					</div>
				))}
			</div>

			{/* Delete Confirmation Modal */}
			{showDeleteModal && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
					<div className='bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4'>
						<h3 className='text-lg font-semibold text-white mb-4'>Confirm Delete</h3>
						<p className='text-gray-300 mb-6'>
							Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
						</p>
						<div className='flex justify-end space-x-4'>
							<button
								onClick={cancelDelete}
								className='px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors'
							>
								Cancel
							</button>
							<button
								onClick={confirmDelete}
								className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors'
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Edit Product Modal */}
			{showEditModal && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
					<div className='bg-gray-800 shadow-lg rounded-lg p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto'>
						<h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Edit Product</h2>
						<form onSubmit={handleEditSubmit} className='space-y-4'>
							<div>
								<label htmlFor='edit-name' className='block text-sm font-medium text-gray-300'>
									Product Name
								</label>
								<input
									type='text'
									id='edit-name'
									value={editFormData.name}
									onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
									className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
									required
								/>
							</div>
							<div>
								<label htmlFor='edit-description' className='block text-sm font-medium text-gray-300'>
									Description
								</label>
								<textarea
									id='edit-description'
									value={editFormData.description}
									onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
									rows='3'
									className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
									required
								/>
							</div>
							<div>
								<label htmlFor='edit-price' className='block text-sm font-medium text-gray-300'>
									Price
								</label>
								<input
									type='number'
									id='edit-price'
									step='0.01'
									value={editFormData.price}
									onChange={(e) => setEditFormData({...editFormData, price: parseFloat(e.target.value)})}
									className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
									required
								/>
							</div>
							<div>
								<label htmlFor='edit-category' className='block text-sm font-medium text-gray-300'>
									Category
								</label>
								<select
									id='edit-category'
									value={editFormData.category}
									onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
									className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
									required
								>
									<option value=''>Select a category</option>
									<option value='jeans'>jeans</option>
									<option value='t-shirts'>t-shirts</option>
									<option value='shoes'>shoes</option>
									<option value='glasses'>glasses</option>
									<option value='jackets'>jackets</option>
									<option value='suits'>suits</option>
									<option value='bags'>bags</option>
								</select>
							</div>
							<div>
								<label htmlFor='edit-image' className='block text-sm font-medium text-gray-300'>
									Image URL
								</label>
								<input
									type='url'
									id='edit-image'
									value={editFormData.image}
									onChange={(e) => setEditFormData({...editFormData, image: e.target.value})}
									className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
									required
								/>
							</div>
							<div className='flex justify-end space-x-4 pt-4'>
								<button
									type='button'
									onClick={cancelEdit}
									className='px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
								>
									Cancel
								</button>
								<button
									type='submit'
									className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
								>
									Update Product
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</motion.div>
	);
};
export default ProductsList;
