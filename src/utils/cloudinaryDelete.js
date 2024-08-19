import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "./apiError.js";

cloudinary.config({
  cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
});

const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;
    const response = await cloudinary.uploader.destroy(publicId);
    console.log("Old avatar/coverImage deleted successfully");
    return response;
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while deleting avatar/coverImage from cloudinary"
    );
  }
};

export { deleteFromCloudinary };
