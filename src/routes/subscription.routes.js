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
  .route("/:channelId/subscribers")
  .get(verifyJWT, getUserChannelSubscribers);
router
  .route("/:subscriberId/subscribedTo")
  .get(verifyJWT, getSubscribedChannels);

export default router;
