import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  isEmailVerified: { type: Boolean, default: false },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const admin = await User.create({
      name: "Bereket",
      email: "bereketeshete89@gmail.com",
      password: "admin123",
      role: "admin",
      isEmailVerified: true,
    });

    console.log("✅ Admin created successfully!");
    console.log("📧 Email: admin@ecommerce.com");
    console.log("🔑 Password: admin123");

    process.exit(0);
  } catch (error) {
    if (error.code === 11000) {
      console.log("❌ Admin user already exists!");
    } else {
      console.error("Error:", error.message);
    }
    process.exit(1);
  }
};

createAdmin();
