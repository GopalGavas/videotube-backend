import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const publishAVideo = asynchandler(async (req, res) => {
  const { title, description } = req.body;

  if ([title, description].some((fields) => fields?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const videoFileLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

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

export { publishAVideo };
