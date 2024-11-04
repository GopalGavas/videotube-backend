import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideoDetails,
  updateVideoThumbnail,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").post(
  verifyJWT,
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishAVideo
);

router.route("/:videoId").get(verifyJWT, getVideoById);
router.route("/v/:videoId").patch(verifyJWT, updateVideoDetails);
router
  .route("/v/:videoId/thumbnail")
  .patch(verifyJWT, upload.single("thumbnail"), updateVideoThumbnail);

router.route("/v/:videoId").delete(verifyJWT, deleteVideo);
router.route("/v/:videoId/status").patch(verifyJWT, togglePublishStatus);
router.route("/").get(verifyJWT, getAllVideos);

export default router;
