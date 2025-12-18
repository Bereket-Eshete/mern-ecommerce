import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, User, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useState } from "react";

const Navbar = () => {
	const { user, logout } = useUserStore();
	const isAdmin = user?.role === "admin";
	const { cart } = useCartStore();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800'>
			<div className='container mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-3'>
				<div className='flex justify-between items-center'>
					<Link to='/' className='text-lg sm:text-xl md:text-2xl font-bold text-emerald-400 flex items-center'>
						E-Commerce
					</Link>

					{/* Desktop Navigation */}
					<nav className='hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-4 sm:gap-6 md:gap-8'>
						<Link
							to={"/"}
							className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out text-sm sm:text-base'
						>
							Home
						</Link>
						<Link
							to={"/about"}
							className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out text-sm sm:text-base'
						>
							About
						</Link>
						<Link
							to={"/contact"}
							className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out text-sm sm:text-base'
						>
							Contact
						</Link>
					</nav>

					{/* Desktop Auth Buttons */}
					<div className='hidden md:flex items-center gap-2 sm:gap-3 md:gap-4'>
						{user && (
							<>
								<Link
									to={"/cart"}
									className='relative group text-gray-300 hover:text-emerald-400 transition duration-300 
								ease-in-out'
								>
									<ShoppingCart className='inline-block mr-1 group-hover:text-emerald-400' size={20} />
									<span className='hidden sm:inline'>Cart</span>
									{cart.length > 0 && (
										<span
											className='absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 
										text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out'
										>
											{cart.length}
										</span>
									)}
								</Link>
								{!isAdmin && (
									<Link
										to={"/dashboard"}
										className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out flex items-center'
									>
										<User className='inline-block mr-1' size={20} />
										<span className='hidden sm:inline'>Dashboard</span>
									</Link>
								)}
							</>
						)}
						{isAdmin && (
							<Link
								className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
								 transition duration-300 ease-in-out flex items-center'
								to={"/secret-dashboard"}
							>
								<Lock className='inline-block mr-1' size={18} />
								<span className='hidden sm:inline'>Dashboard</span>
							</Link>
						)}

						{user ? (
							<button
								className='bg-gray-700 hover:bg-gray-600 text-white py-1.5 sm:py-2 px-2 sm:px-3 md:px-4 
						rounded-md flex items-center transition duration-300 ease-in-out text-sm sm:text-base'
								onClick={logout}
							>
								<LogOut size={16} className='sm:w-4 sm:h-4 md:w-5 md:h-5' />
								<span className='hidden sm:inline ml-1 sm:ml-2'>Log Out</span>
							</button>
						) : (
							<>
								<Link
									to={"/signup"}
									className='bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 sm:py-2 px-2 sm:px-3 md:px-4 
									rounded-md flex items-center transition duration-300 ease-in-out text-sm sm:text-base'
								>
									<UserPlus className='w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 sm:mr-2' />
									<span className='hidden sm:inline'>Sign Up</span>
								</Link>
								<Link
									to={"/login"}
									className='bg-gray-700 hover:bg-gray-600 text-white py-1.5 sm:py-2 px-2 sm:px-3 md:px-4 
									rounded-md flex items-center transition duration-300 ease-in-out text-sm sm:text-base'
								>
									<LogIn className='w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 sm:mr-2' />
									<span className='hidden sm:inline'>Login</span>
								</Link>
							</>
						)}
					</div>

					{/* Mobile Hamburger */}
					<button
						className='md:hidden text-white'
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>

				{/* Mobile Menu */}
				{isMenuOpen && (
					<div className='md:hidden mt-4 pb-4 border-t border-gray-700'>
						<div className='flex flex-col space-y-4 pt-4'>
							<Link
								to={"/"}
								className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
								onClick={() => setIsMenuOpen(false)}
							>
								Home
							</Link>
							<Link
								to={"/about"}
								className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
								onClick={() => setIsMenuOpen(false)}
							>
								About
							</Link>
							<Link
								to={"/contact"}
								className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
								onClick={() => setIsMenuOpen(false)}
							>
								Contact
							</Link>
							{user && (
								<>
									<Link
										to={"/cart"}
										className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out flex items-center'
										onClick={() => setIsMenuOpen(false)}
									>
										<ShoppingCart className='mr-2' size={20} />
										Cart {cart.length > 0 && `(${cart.length})`}
									</Link>
									{!isAdmin && (
										<Link
											to={"/dashboard"}
											className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out flex items-center'
											onClick={() => setIsMenuOpen(false)}
										>
											<User className='mr-2' size={20} />
											Dashboard
										</Link>
									)}
								</>
							)}
							{isAdmin && (
								<Link
									to={"/secret-dashboard"}
									className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out flex items-center'
									onClick={() => setIsMenuOpen(false)}
								>
									<Lock className='mr-2' size={20} />
									Admin Dashboard
								</Link>
							)}
							{user ? (
								<button
									className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out flex items-center'
									onClick={() => {
										logout();
										setIsMenuOpen(false);
									}}
								>
									<LogOut className='mr-2' size={20} />
									Log Out
								</button>
							) : (
								<>
									<Link
										to={"/signup"}
										className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out flex items-center'
										onClick={() => setIsMenuOpen(false)}
									>
										<UserPlus className='mr-2' size={20} />
										Sign Up
									</Link>
									<Link
										to={"/login"}
										className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out flex items-center'
										onClick={() => setIsMenuOpen(false)}
									>
										<LogIn className='mr-2' size={20} />
										Login
									</Link>
								</>
							)}
						</div>
					</div>
				)}
			</div>
		</header>
	);
};
export default Navbar;
