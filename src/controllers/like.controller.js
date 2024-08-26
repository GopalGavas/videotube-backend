import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Like } from "../models/like.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";

const toggleTweetLike = asynchandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!tweetId) {
    throw new ApiError(400, "Invalid tweet Id");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  const likedTweet = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user?._id,
  }).select("-video -comment");

  if (likedTweet) {
    await Like.findByIdAndDelete(likedTweet._id);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { tweetId, isLiked: false },
          "Unliked tweet successfully"
        )
      );
  } else {
    await Like.create({
      tweet: tweetId,
      likedBy: req.user?._id,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { tweetId, isLiked: true },
          "Liked tweet successfully"
        )
      );
  }
});

const toggleCommentLike = asynchandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) {
    throw new ApiError("Invalid Comment Id");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const likedComment = await Like.findOne({
    comment: commentId,
    likedBy: req.user?._id,
  }).select("-tweet -video");

  if (likedComment) {
    await Like.findByIdAndDelete(likedComment._id);
    return res
      .status(200)
      .json(
        new ApiResponse(200, { isLiked: false }, "Comment unliked successfully")
      );
  } else {
    await Like.create({
      comment: commentId,
      likedBy: req.user?._id,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, { isLiked: true }, "Comment liked successfully")
      );
  }
});

const toggleVideoLike = asynchandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Invalid Video Id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const likedVideo = await Like.findOne({
    video: videoId,
    likedBy: req.user?._id,
  }).select("-tweet -comment");

  if (likedVideo) {
    await Like.findByIdAndDelete(videoId);

    return res
      .status(200)
      .json(
        new ApiResponse(200, { isLiked: false }, "Video unliked successfully")
      );
  } else {
    await Like.create({
      video: video._id,
      likedBy: req.user?._id,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, { isLiked: true }, "Video Liked successfully")
      );
  }
});

const getLikedVideos = asynchandler(async (req, res) => {
  const allLikedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "likedVideo",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "ownerDetails",
            },
          },
          {
            $unwind: "$ownerDetails",
          },
        ],
      },
    },
    {
      $unwind: "$likedVideo",
    },
    {
      $project: {
        _id: 0,
        likedVideo: {
          _id: 1,
          videoFile: 1,
          thumbnail: 1,
          owner: 1,
          title: 1,
          description: 1,
          views: 1,
          duration: 1,
          isPublished: 1,
          ownerDetails: {
            username: 1,
            avatar: 1,
          },
        },
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        allLikedVideos,
        "All liked videos fetched successfully"
      )
    );
});

export { toggleTweetLike, toggleCommentLike, toggleVideoLike, getLikedVideos };
