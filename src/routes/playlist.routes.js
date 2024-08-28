import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUsersPlaylist,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();

router.route("/").post(verifyJWT, createPlaylist);
router.route("/:playlistId").patch(verifyJWT, updatePlaylist);
router.route("/:playlistId").delete(verifyJWT, deletePlaylist);
router.route("/add/:playlistId/:videoId").patch(verifyJWT, addVideoToPlaylist);
router
  .route("/remove/:playlistId/:videoId")
  .patch(verifyJWT, removeVideoFromPlaylist);

router.route("/:playlistId").get(verifyJWT, getPlaylistById);
router.route("/user/:userId").get(verifyJWT, getUsersPlaylist);

export default router;
