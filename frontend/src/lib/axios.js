import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "https://mern-ecommerce-2-5seq.onrender.com/api",
	withCredentials: true, // send cookies to the server
});

// Clean axios instance without debug logging

export default axiosInstance;
