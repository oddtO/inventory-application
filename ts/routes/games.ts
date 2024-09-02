import express from "express";
import { gamesController } from "../controllers/gamesController";

const gamesRoute = express.Router();

gamesRoute.get("/new", gamesController.getNewGameForm);

export default gamesRoute;
