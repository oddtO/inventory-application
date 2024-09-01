import express from "express";
import path from "path";
import { indexController } from "./controllers/indexController";
import publishersRoute from "./routes/publishers";
const app = express();

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "../public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views/"));

app.use("/publishers", publishersRoute);
app.get("/", indexController.get);
app.post("/", indexController.post);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
