import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";

const registerUser = asynchandler(async (req, res) => {
  res.status(200).json({
    message: "success",
  });
});

export { registerUser };
