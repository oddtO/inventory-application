import express from "express";
import { publishersController } from "../controllers/publishersController";
const publishersRoute = express.Router();

publishersRoute.get("/", publishersController.get);

publishersRoute.get("/new", publishersController.getNewPublisherForm);

publishersRoute.post("/new", publishersController.postNewPublisherForm);

export default publishersRoute;