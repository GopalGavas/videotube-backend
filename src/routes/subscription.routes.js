import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";

const router = Router();

router.route("/:channelId").post(verifyJWT, toggleSubscription);
router
  .route("/subscribers/:channelId")
  .get(verifyJWT, getUserChannelSubscribers);
router
  .route("/subscriptions/:subscriberId")
  .get(verifyJWT, getSubscribedChannels);

export default router;
