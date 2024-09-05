import express from "express";
import { publishersController } from "../controllers/publishersController";
const publishersRoute = express.Router();

publishersRoute.get("/", publishersController.get);

publishersRoute.get("/new", publishersController.getNewPublisherForm);

publishersRoute.post("/new", publishersController.postNewPublisherForm);
publishersRoute.get("/update/:id", publishersController.getUpdatePublisherForm);
publishersRoute.post(
  "/update/:id",
  publishersController.postUpdatePublisherForm,
);
publishersRoute.post("/delete/:id", publishersController.postDeletePublisher);
export default publishersRoute;
