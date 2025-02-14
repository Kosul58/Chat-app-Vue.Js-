import express from "express";
import cors from "cors";
import users from "./user.js";
import searchusers from "./searchuser.js";
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
