import axios from "axios";

const axiosInstance = axios.create({
	baseURL: import.meta.mode === "development" ? "https://mern-ecommerce-ou8n.onrender.com/api" : "/api",
	withCredentials: true, // send cookies to the server
});

export default axiosInstance;
