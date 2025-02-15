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

const addfriend = async (id1, id2) => {
  await connectDB();
  try {
    const uid = id1;
    const fid = id2;
    const user = await User.find({ _id: uid });
    const friend = await User.find({ _id: fid });
    console.log(user[0]);
    const userHasFriend = user[0].message.some((friend) => friend.id === id2);
    if (userHasFriend) {
      console.log("User already has this friend.");
      return "already friends";
    } else {
      const add1 = {
        id: uid,
        name: user[0].name,
        message: {
          [uid]: [],
          [fid]: [],
        },
      };

      const add2 = {
        id: fid,
        name: friend[0].name,
        message: {
          [uid]: [],
          [fid]: [],
        },
      };

      await User.findByIdAndUpdate(id1, {
        $push: { message: add2 },
      });

      await User.findByIdAndUpdate(id2, {
        $push: { message: add1 },
      });

      const userx = await User.find({ _id: uid });

      return userx;
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
  } finally {
    await closeConn(); // Always close the connection
  }
};

export default addfriend;
