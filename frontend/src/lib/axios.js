import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "https://mern-ecommerce-2-5seq.onrender.com/api",
	withCredentials: true, // send cookies to the server
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
	(config) => {
		console.log('Making request to:', config.baseURL + config.url);
		return config;
	},
	(error) => {
		console.error('Request error:', error);
		return Promise.reject(error);
	}
);

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
	(response) => {
		console.log('Response received:', response.status, response.data);
		return response;
	},
	(error) => {
		console.error('Response error:', error.response?.status, error.response?.data || error.message);
		return Promise.reject(error);
	}
);

export default axiosInstance;
