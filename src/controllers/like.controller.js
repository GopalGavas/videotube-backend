import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Like } from "../models/like.model.js";
import { Tweet } from "../models/tweet.model.js";

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

export { toggleTweetLike };
