import Router from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet } from "../controllers/tweet.controller.js";

const router = Router();

router.route("/create-tweet").post(verifyJWT, createTweet);

export default router;
