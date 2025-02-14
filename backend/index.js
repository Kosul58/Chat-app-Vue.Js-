import express from "express";
import cors from "cors";
const app = express();
const port = 3010;

app.use(express.json());
app.use(cors());

app.post("/registeruser", async (req, res) => {
  const data = req.body;
});

app.post("/loginuser", async (req, res) => {
  const data = req.body;
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
