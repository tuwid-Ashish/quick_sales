import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
export const AuthTokenverify = asyncHandler(async (req, res, next) => {
  try {
    const Token =
    req.cookies?.access_token ||
      String(req.header("Authorization"))?.replace("Bearer ", "");
      
    console.log("i get this access token ",Token);
    
    if (!Token || Token == "undefined" ||Token == undefined) {
      return res.status(401).json(new ApiError(401, "Unauthorized request"));
    }

    const decodedtoken = jwt.verify(
      Token,
      process.env.JWT_ACCESS_TOKENT_SECRET,
    );
    console.log("my decodedtoken",decodedtoken);
    const user = await User.findById(decodedtoken?._id).select(
      "-password -refreshtoken",
    );

    console.log("my user",
    user);
    
    if (!user) {
        // UserExist: userexist
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});