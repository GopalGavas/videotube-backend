import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/cloudinaryDelete.js";
import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";

const publishAVideo = asynchandler(async (req, res) => {
  const { title, description } = req.body;

  if ([title, description].some((fields) => fields?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!videoFileLocalPath) {
    throw new ApiError(400, "could not locate Video File Locally");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "could not locate thumbnail file locally");
  }

  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (
    [videoFile, thumbnail].some((field) => !field || field.url?.trim() === "")
  ) {
    throw new ApiError(400, "videoFile and thumbnail is required");
  }

  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    owner: req.user?._id,
    title,
    description,
    duration: videoFile.duration,
    isPublished: true,
  });

  const videoUpload = await Video.findById(video._id);

  if (!videoUpload) {
    throw new ApiError(500, "Something went wrong while uploading the video");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videoUpload, "Video uploaded successfully"));
});

const getVideoById = asynchandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Invalid vidoe Id");
  }

  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "comments",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $lookup: {
              from: "subscribers",
              localField: "_id",
              foreignField: "channel",
              as: "subscribers",
            },
          },
          {
            $addFields: {
              subscribersCount: {
                $size: "$subscribers",
              },

              isSubscribed: {
                $cond: {
                  if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                  then: true,
                  else: false,
                },
              },
            },
          },
          {
            $project: {
              username: 1,
              avatar: 1,
              subscribersCount: 1,
              isSubscribed: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        likesCount: {
          $size: "$likes",
        },
        owner: {
          $first: "$owner",
        },
        isLiked: {
          $cond: {
            if: { $in: [req.user?._id, "$likes.likedBy"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        comments: 1,
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        views: 1,
        duration: 1,
        createdAt: 1,
        owner: 1,
        likesCount: 1,
        isLiked: 1,
      },
    },
  ]);

  if (!video) {
    throw new ApiError(500, "failed to fetch video");
  }

  await Video.findByIdAndUpdate(videoId, {
    $inc: {
      views: 1,
    },
  });

  await User.findByIdAndUpdate(req.user?._id, {
    $addToSet: {
      watchHistory: videoId,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, video[0], "video details fetched successfully"));
});

const updateVideoDetails = asynchandler(async (req, res) => {
  const { title, description } = req.body;
  const { videoId } = req.params;

  if (!title?.trim() || !description?.trim()) {
    throw new ApiError(400, "title and description are required");
  }

  if (!videoId) {
    throw new ApiError(400, "Invalid Video Id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(401, "You are not allowed to update the Video");
  }

  const updatedVideoDetails = await Video.findByIdAndUpdate(
    video._id,
    {
      $set: {
        title,
        description,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedVideoDetails) {
    throw new ApiError(500, "Failed to update user details");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedVideoDetails,
        "Updated Video details successfully"
      )
    );
});

const updateVideoThumbnail = asynchandler(async (req, res) => {
  const { videoId } = req.params;
  const thumbnailLocalPath = req.file?.path;

  if (!videoId) {
    throw new ApiError(400, "Invalid Video Id");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Could not find localPath for thumbnail");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!thumbnail.url) {
    throw new ApiError(400, "Error while uploading file on Cloudinary");
  }

  const video = await Video.findById(videoId).select("thumbnail");
  const oldThumbnail = video?.thumbnail;

  const updatedThumbnail = await Video.findByIdAndUpdate(
    video?._id,
    {
      $set: {
        thumbnail: thumbnail?.url,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedThumbnail) {
    throw new ApiError(
      500,
      "Something went wrong while updating the thumbnail"
    );
  }

  if (oldThumbnail) {
    const publicId = oldThumbnail.split("/").pop().split(".")[0];

    await deleteFromCloudinary(publicId);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedThumbnail,
        "Successfully updated Video Thumbnail"
      )
    );
});

const deleteVideo = asynchandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Invalid Video Id");
  }

  const video = await Video.findById(videoId).select(
    "thumbnail videoFile owner"
  );

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const videoFile = video?.videoFile;
  const thumbnail = video?.thumbnail;

  const publicIdVideoFile = videoFile.split("/").pop().split(".")[0];
  console.log(publicIdVideoFile);
  const publicIdThumbNailFile = thumbnail.split("/").pop().split(".")[0];

  if (video.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      401,
      "Unauthorized!! You are not allowed to delete this video"
    );
  }

  const deletedVideo = await Video.findByIdAndDelete(videoId);

  if (!deletedVideo) {
    throw new ApiError(500, "Something went wrong while deleting the Video");
  }

  await deleteFromCloudinary(publicIdVideoFile, "video");
  await deleteFromCloudinary(publicIdThumbNailFile);

  await Like.deleteMany({
    video: videoId,
  });

  await Comment.deleteMany({
    video: videoId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted Successfully"));
});

const getAllVideos = asynchandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
});

const togglePublishStatus = asynchandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Invalid User Id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      401,
      "Unauthorized!!: you are not authorized for this action"
    );
  }

  const toggleVideoStatus = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        isPublished: !video?.isPublished,
      },
    },
    {
      new: true,
    }
  );

  if (!toggleVideoStatus) {
    throw new ApiError(500, "Something went wrong while updating the status");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, toggleVideoStatus, "Status changed successfully")
    );
});

export {
  publishAVideo,
  getVideoById,
  updateVideoDetails,
  updateVideoThumbnail,
  deleteVideo,
  togglePublishStatus,
};
