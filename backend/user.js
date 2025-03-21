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

const users = async (uinfo, control) => {
  await connectDB();
  try {
    let { username, password, email, image } = uinfo;

    const user = await User.findOne({ name: username, password: password });
    if (control === "login") {
      return user ? user : "no users";
    } else if (control === "register") {
      if (user) {
        console.log("User already exists");
        return 0;
      } else {
        const newUser = new User({
          email,
          name: username,
          password,
          image,
          message: [],
        });
        const savedUser = await newUser.save();
        return savedUser;
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  } finally {
    await closeConn();
  }
};

export default users;
