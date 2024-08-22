import { asynchandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { Tweet } from "../models/tweet.model.js";
import mongoose from "mongoose";

const createTweet = asynchandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Tweet content is required");
  }

  const tweet = await Tweet.create({
    content,
    owner: req.user?._id,
  });

  if (!tweet) {
    throw new ApiError(400, "Tweet not found");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

// const getUserTweets = asynchandler(async (req, res) => {
//   const { username } = req.params;

//   if (!username) {
//     throw new ApiError(400, "username does not exists");
//   }

//   const tweet = await Tweet.aggregate([
//     {
//       $match: {
//         owner: new mongoose.Types.ObjectId(req.user._id),
//       },
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "owner",
//         foreignField: "_id",
//         as: "owner",
//         pipeline: [
//           {
//             $project: {
//               username: 1,
//               "avatar.url": 1,
//             },
//           },
//         ],
//       },
//     },
//     {
//       $lookup: {
//         from: "likes",
//         localField: "_id",
//         foreignField: "tweet",
//         as: "likeDetails",
//         pipeline: [
//           {
//             $project: {
//               likedBy: 1,
//             },
//           },
//         ],
//       },
//     },
//     {
//       $addFields: {
//         likesCount: {
//           $size: "$likeDetails",
//         },
//         ownerDetails: {
//           $size: "$owner",
//         },
//         isLiked: {
//           $cond: {
//             if: { $in: [req.user?._id, "$likeDetails.likedBy"] },
//             then: true,
//             else: false,
//           },
//         },
//       },
//     },
//     {
//       $project: {
//         content: 1,
//         ownerDetails: 1,
//         likesCount: 1,
//         isLiked: 1,
//         createdAt: 1,
//       },
//     },
//   ]);
// });

export { createTweet };
