import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Subscription } from "../models/subscription.model.js";
import mongoose from "mongoose";

const toggleSubscription = asynchandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId) {
    throw new ApiError(400, "Invalid Channel Id");
  }

  const isSubscribed = await Subscription.findOne({
    subscriber: req.user?._id,
    channel: channelId,
  });

  if (isSubscribed) {
    await Subscription.findOneAndDelete({
      subscriber: req.user?._id,
      channel: channelId,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, { subscribed: false }, "Unsubscribed successfully")
      );
  } else {
    await Subscription.create({
      subscriber: req.user?._id,
      channel: channelId,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { subscribed: true },
          "Subscibed to  Channel successfully"
        )
      );
  }
});

//  controller to return subscriber list of a channel
const getUserChannelSubscribers = asynchandler(async (req, res) => {
  let { channelId } = req.params;

  if (!channelId) {
    throw new ApiError(400, "Invalid channelId");
  }

  channelId = new mongoose.Types.ObjectId(channelId);

  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: channelId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriber",
      },
    },
    {
      $unwind: "$subscriber",
    },
    {
      $project: {
        _id: 0,
        subscriber: {
          _id: 1,
          username: 1,
          avatar: 1,
        },
      },
    },
  ]);

  const subscriberCount = subscribers.length;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { subscribers, subscriberCount },
        "subscribers fetched successfully"
      )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asynchandler(async (req, res) => {
  let { subscriberId } = req.params;

  if (!subscriberId) {
    throw new ApiError(400, "Invalid Subscriber Id");
  }

  subscriberId = new mongoose.Types.ObjectId(subscriberId);

  const subscribedTo = await Subscription.aggregate([
    {
      $match: {
        subscriber: subscriberId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "subscribed",
      },
    },
    {
      $unwind: "$subscribed",
    },
    {
      $project: {
        _id: 0,
        subscribed: {
          _id: 1,
          username: 1,
          avatar: 1,
        },
      },
    },
  ]);

  const subscribedToCount = subscribedTo.length;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { subscribedTo, subscribedToCount },
        "User subscriptions fetched successfully"
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
