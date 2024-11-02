import Router from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateUserTweet,
} from "../controllers/tweet.controller.js";

const router = Router();

router.route("/").post(verifyJWT, createTweet);
router.route("/:tweetId").patch(verifyJWT, updateUserTweet);
router.route("/:tweetId").delete(verifyJWT, deleteTweet);
router.route("/:username").get(verifyJWT, getUserTweets);

export default router;
