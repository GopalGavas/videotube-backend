import { Router } from "express";
import {
  getVideoById,
  publishAVideo,
  updateVideoDetails,
  updateVideoThumbnail,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/upload-video").post(
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
router.route("/:videoId/details").patch(verifyJWT, updateVideoDetails);
router
  .route("/:videoId/thumbnail")
  .patch(verifyJWT, upload.single("thumbnail"), updateVideoThumbnail);

export default router;
