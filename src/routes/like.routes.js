import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getLikedVideos,
  toggleTweetLike,
  toggleVideoLike,
} from "../controllers/like.controller.js";

const router = Router();

router.route("/toggle/t/:tweetId").post(verifyJWT, toggleTweetLike);
router.route("/toggle/v/:videoId").post(verifyJWT, toggleVideoLike);
router.route("/videos").get(verifyJWT, getLikedVideos);

export default router;
