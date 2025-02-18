import express from "express";
import cors from "cors";
import users from "./user.js";
import searchusers from "./searchuser.js";
import addfriend from "./addfriend.js";
import sendmessage from "./sendmessage.js";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const port = 3000;

app.use(express.json());
app.use(cors());

const onlineUsers = new Map(); // Store online users

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust for frontend URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // console.log("User connected", socket.id);
  // console.log(onlineUsers);
  // Handle user online event
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

app.post("/registeruser", async (req, res) => {
  const userinfo = req.body;
  const control = "register";
  // console.log(userinfo);
  const data = await users(userinfo, control);
  // console.log(data);
  res.json(data);
});

app.post("/loginuser", async (req, res) => {
  const userinfo = req.body;
  const control = "login";
  const data = await users(userinfo, control);
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
