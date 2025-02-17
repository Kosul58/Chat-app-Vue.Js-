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

const sendmessage = async (message, uid, fid) => {
  await connectDB();
  try {
    const user = await User.findOne({ _id: uid });
    const friend = await User.findOne({ _id: fid });
    // console.log(user.message, friend.message, message);
    const date = new Date().toISOString();
    const msg1 = [message, date];
    // console.log(msg1);

    //sathi ko ma msg update garna
    const userMessageObj = user.message.find((m) => m.id === fid);
    if (userMessageObj) {
      if (!userMessageObj.message[uid]) {
        userMessageObj.message[uid] = [];
      }
      userMessageObj.message[uid].push(msg1);
    } else {
      console.log("Sathi bhetiyena.");
    }

    //afno ma msg update garna
    const friendMessageObj = friend.message.find((m) => m.id === uid);
    if (friendMessageObj) {
      if (!friendMessageObj.message[uid]) {
        friendMessageObj.message[uid] = [];
      }
      friendMessageObj.message[uid].push(msg1);
    } else {
      console.log("Sathi sanga friend chaina.");
    }

    // console.log(userMessageObj.message, friendMessageObj.message);

    // Save updated user and friend in the database
    const data = await User.findByIdAndUpdate(uid, { message: user.message });
    await User.findByIdAndUpdate(fid, { message: friend.message });
    console.log("Message sent successfully.");
    return data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  } finally {
    await closeConn();
  }
};

export default sendmessage;
