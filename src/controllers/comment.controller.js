import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";

const addComment = asynchandler(async (req, res) => {
  const { content } = req.body;
  const { videoId } = req.params;

  if (!content) {
    throw new ApiError(400, "Content is requried");
  }

  if (!videoId) {
    throw new ApiError(400, "Invalid Video Id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video Not found");
  }

  const comment = await Comment.create({
    content,
    video: video._id,
    owner: req.user?._id,
  });

  if (!comment) {
    throw new ApiError(500, "Something went wrong, while creating the comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment created successfully"));
});

export { addComment };
