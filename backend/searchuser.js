import mongoose from "mongoose";
import User from "./users.cjs";
import dotenv from "dotenv";
dotenv.config();

// Updated MongoDB connection URI
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit process on failure
  }
};

const closeConn = async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("MongoDB connection close error:", error.message);
  }
};

const searchusers = async (uinfo) => {
  await connectDB();
  try {
    const name = uinfo;
    const users = await User.find({ name: name });
    console.log("user found");
    if (users.length > 0) {
      return users;
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return []; // Return empty array in case of an error
  } finally {
    await closeConn(); // Always close the connection
  }
};

export default searchusers;
