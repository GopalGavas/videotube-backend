import { asynchandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

const healthCheck = asynchandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, { message: "Everything is ok" }, "OK"));
});

export { healthCheck };
