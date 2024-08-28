import express from "express";
import { db } from "./db/queries";
import path from "path";
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views/"));
app.get("/", async (req, res) => {
  const results = await db.getAllTest();
  res.render("index");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
