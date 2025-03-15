import express from "express";
import cors from "cors";
import users from "./user.js";
import searchusers from "./searchuser.js";
import addfriend from "./addfriend.js";
import sendmessage from "./sendmessage.js";
import userlist from "./userlist.js";
import http from "http";
import { Server } from "socket.io";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

const app = express();
const server = http.createServer(app);
const port = 3000;

app.use(express.json());
app.use(cors());

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user_profiles", // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

const onlineUsers = new Map(); // Store online users

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://chat-app-vue-js.vercel.app"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("user-online", (userid) => {
    onlineUsers.set(userid, socket.id);
    // console.log(`User ${userid} is online with socket id ${socket.id}`);
    // // Notify all clients that this user is online
    // io.emit("user-status", { userid, status: "online" });
  });

  socket.on("send-message", (msg) => {
    const [message, uid, fid] = msg;
    // console.log("message", message);
    // console.log("from", uid);
    // console.log("to", fid);
    // Find the recipient's socket ID
    const recipientSocketId = onlineUsers.get(fid);

    if (recipientSocketId) {
      // Send message only to the intended recipient
      io.to(recipientSocketId).emit("message", {
        message,
        sender: uid,
        receiver: fid,
      });
      // console.log(`Message sent to ${fid} (Socket ID: ${recipientSocketId})`);
    } else {
      console.log(`User ${fid} is offline, message not sent.`);
    }
  });
});

app.post("/registeruser", upload.single("image"), async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const imageUrl = req.file ? req.file.path : ""; // Cloudinary image URL

    const userinfo = { username, email, password, image: imageUrl };
    const control = "register";
    const data = await users(userinfo, control);

    res.json(data);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/loginuser", async (req, res) => {
  const userinfo = req.body;
  const control = "login";
  const data = await users(userinfo, control);
  // console.log(data);
  res.json(data);
});

app.get("/reloaddata", async (req, res) => {
  const { query } = req.query;
  const data = await userlist(query);
  // console.log(data);
  res.json(data);
});

app.post("/searchuser", async (req, res) => {
  const userinfo = req.body.name;
  const data = await searchusers(userinfo);
  res.json(data);
});

app.post("/addfriend", async (req, res) => {
  const { myid, friendid } = req.body;
  // console.log(myid, friendid);
  const data = await addfriend(myid, friendid);
  res.json(data);
});

app.post("/sendmymessage", async (req, res) => {
  const message = req.body.msg;
  const uid = req.body.uid;
  const fid = req.body.fid;
  // console.log(message, uid, fid);
  const data = await sendmessage(message, uid, fid);
  res.json(data);
});

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
