import express, { Router, Request, Response } from "express";
const router: Router = express.Router();
import artistRouter from "./artist.routes";
import userRouter from "./user.routes";

router.get("/", (req, res) => {
  res.status(200).send("Hello! This is the home page of Tattoo server!");
});

router.use("/artist", artistRouter);
router.use("/user", userRouter);

export default router;
