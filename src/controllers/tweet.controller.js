import { asynchandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { Tweet } from "../models/tweet.model.js";

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

const updateUserTweet = asynchandler(async (req, res) => {
  const { content } = req.body;
  const { tweetId } = req.params;

  if (!content) {
    throw new ApiError(400, "Tweet content is required.");
  }

  if (!tweetId) {
    throw new ApiError(400, "A valid Tweet ID is required.");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet?.owner.toString() !== req.user?._id.toString()) {
    // console.log("Tweet owner: ", tweet?.owner.toString());
    // console.log("user id: ", req.user?._id);
    throw new ApiError(
      401,
      "Unauthorized: You do not have permission to update this tweet."
    );
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content,
      },
    },
    { new: true }
  );

  if (!updatedTweet) {
    throw new ApiError(500, "Something went wrong while updating the tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
});

const deleteTweet = asynchandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!tweetId) {
    throw new ApiError(400, "A valid tweet Id is required");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      401,
      "Unauthorized!!: You do not have permission to delete this tweet"
    );
  }

  await Tweet.findByIdAndDelete(tweetId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet deleted successfully"));
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

export { createTweet, updateUserTweet, deleteTweet };
