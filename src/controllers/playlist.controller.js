import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";

const createPlaylist = asynchandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "Name and Description is required");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user?._id,
  });

  if (!playlist) {
    throw new ApiError(500, "Failed to create Playlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist created successfully"));
});

const updatePlaylist = asynchandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!playlistId) {
    throw new ApiError(400, "Invalid PlayList Id");
  }

  if (!name || !description) {
    throw new ApiError(400, "name and description is required");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (playlist?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      401,
      "Unauthorized!! You are not allowed to update this playlist"
    );
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: {
        name,
        description,
      },
    },
    { new: true }
  );

  if (!updatedPlaylist) {
    throw new ApiError(500, "Something went wrong while updating the playlist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlaylist, "Playlist updated successfully")
    );
});

const deletePlaylist = asynchandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    throw new ApiError(400, "Invalid  playlist Id");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (playlist?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      401,
      "Unauthorized!! You are not allowed to delete this video"
    );
  }

  const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

  if (!deletedPlaylist) {
    throw new ApiError(500, "Something went wrong while deleting the playlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist deleted successfully"));
});

const addVideoToPlaylist = asynchandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!playlistId || !videoId) {
    throw new ApiError(400, "Invalid PlaylistId or VideoId");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (playlist?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      401,
      "Unauthorized!! you are not authorized for this action"
    );
  }

  const addVideo = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $addToSet: {
        videos: video?._id,
      },
    },
    { new: true }
  );

  if (!addVideo) {
    throw new ApiError(500, "Failed to add video to the playlist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, addVideo, "Video added to playlist successfully")
    );
});

const removeVideoFromPlaylist = asynchandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!playlistId || !videoId) {
    throw new ApiError(400, "Invalid PlaylistId or VideoId");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (playlist?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      401,
      "Unauthorized!! you are not authorized for this action"
    );
  }

  const removeVideo = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $pull: {
        videos: video?._id,
      },
    },
    { new: true }
  );

  if (!removeVideo) {
    throw new ApiError(
      500,
      "Something went wrong while removing the video from the playlist"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        removeVideo,
        "Successfully video removed from the Playlist"
      )
    );
});

const getPlaylistById = asynchandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    throw new ApiError(400, "Invalid Playlist Id");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  const playlistVideos = await Playlist.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(playlistId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
      },
    },
    {
      $match: {
        "videos.isPublished": true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "playlistOwner",
      },
    },
    {
      $addFields: {
        allVideos: {
          $size: "$videos",
        },
        owner: {
          $first: "$playlistOwner",
        },
      },
    },
    {
      $project: {
        name: 1,
        description: 1,
        allVideos: 1,
        createdAt: 1,
        updatedAt: 1,
        videos: {
          _id: 1,
          videoFile: 1,
          thumbnail: 1,
          title: 1,
          description: 1,
          views: 1,
          duration: 1,
          createdAt: 1,
        },
        owner: {
          username: 1,
          avatar: 1,
        },
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlistVideos[0], "Playlist fetched successfully")
    );
});

const getUsersPlaylist = asynchandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError("Invalid User Id");
  }

  const userPlaylist = await Playlist.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "playlistVideos",
      },
    },
    {
      $addFields: {
        playlist: {
          $size: "$playlistVideos",
        },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        playlist: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  if (!userPlaylist) {
    throw new ApiError(500, "Problem while fetching Users Playlist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, userPlaylist, "Users playlist fetched successfully")
    );
});

export {
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  getPlaylistById,
  getUsersPlaylist,
};
