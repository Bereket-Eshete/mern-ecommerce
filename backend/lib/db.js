import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		console.log('MONGO_URI:', process.env.MONGO_URI ? 'Found' : 'Not found');
		
		if (!process.env.MONGO_URI) {
			throw new Error('MONGO_URI environment variable is not defined');
		}
		
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		console.log("Error connecting to MONGODB", error.message);
		process.exit(1);
	}
};
