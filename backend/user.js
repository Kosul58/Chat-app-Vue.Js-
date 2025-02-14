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
    let name = uinfo.username;
    let password = uinfo.password;
    let email = uinfo.email;
    const user = await User.findOne({ name: name, password: password });
    if (control === "login") {
      if (user) {
        return user;
      } else {
        return "no users";
      }
    } else if (control === "register") {
      if (user) {
        console.log("user already exists");
        return 0;
      } else {
        const data = new User({
          email: email,
          name: name,
          password: password,
          message: [],
        });
        const savedUser = await data.save();
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
