import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleTweetLike } from "../controllers/like.controller.js";

const router = Router();

router.route("/:tweetId").post(verifyJWT, toggleTweetLike);

export default router;
