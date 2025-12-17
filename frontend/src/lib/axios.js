import axios from "axios";

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "https://mern-ecommerce-2-5seq.onrender.com/api",
	withCredentials: true, // send cookies to the server
});

// Clean axios instance without debug logging

export default axiosInstance;
