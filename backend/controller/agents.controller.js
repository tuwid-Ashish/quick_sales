import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import nodemailer from "nodemailer";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOncloudinary } from "../utils/Cloudinary.js";
import mongoose from "mongoose"
import Shop from "../models/shop.model.js";
import QRCode from "qrcode"
import { Commission } from "../models/Commission.model.js";

const options = {
  httpOnly: true,
  secure: true,         // since you're on HTTP
  sameSite: "None",  
};
const GenerateToken = async (userid) => {
  try {
    console.log(userid);
    const user = await User.findById(userid);
    console.log(user);
    const access_token = user.jwt_access_token();
    const refresh_token = user.jwt_refresh_token();
    user.refreshtoken = refresh_token;
    const updateuser = await user.save({ validateBeforeSave: false });
    return { access_token, refresh_token, updateuser };
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "something wrong while generating token");
  }
};
const RegiesterUser = asyncHandler(async (req, res) => {
   
  const { username, password, email } =
    req.body;

  console.log("my request body is", req.body);
  if (
    [ username, password, email].some((filed) => filed?.trim() === "")
  ) {
    throw new ApiError(400, "the filed cannot be empty");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "user already exist with this username and email");
  }

  console.log(username);
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
  });

  const CreateUser = await User.findById(user._id).select(
    "-password -refeshtoken"
  );

  if (!CreateUser) {
    throw new ApiError(500, "something wrong while creating user in db");
  }

  res
    .status(200)
    .json(new ApiResponse(200, CreateUser, "user created sucessfully"));
});

const emailer = asyncHandler(async (req, res) => {
  const { email, Emailtype } = req.body;
  let verificationCode = Math.floor(100000 + Math.random() * 900000);
  console.log("this function runs ");

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'eladio69@ethereal.email',
      pass: 'KPtr2haJzKgz9rBTyM'
    }
  });
  console.log("the connection is done", req.body);
  const mailtoken = await transporter.sendMail({
    from: '"Campus Media 😊" <maddison53@ethereal.email>', // sender address
    to: `${email}`, // list of receivers
    subject: Emailtype !== "verifyEmail" ? "Password reset Verification token " : "email verification token is", // Subject line
    text: "your 6 digit email verification code is ", // plain text body
    html: `<h1>your 6 digit email verification code is </h1> <b>${verificationCode}<b/>`, // html body
  });
  console.log("this function sended mail ");
  console.log(mailtoken.messageId);
  mailtoken.messageId
    ? console.log("email sended sucessfully")
    : console.log("error occured on sending email");
  res
    .status(200)
    .json(
      new ApiResponse(200, { verificationCode }, "email sended sucessfully")
    );
});
const loginUsers = asyncHandler(async (req, res) => {
  const { email,username, password } = req.body;
  let identifier = email || username;
  console.log("this is the body", req.body);
  if ([identifier, password].some((filed) => filed?.trim() === "")) {
    throw new ApiError(400, "the filed cannot be empty");
  }

  const userexist = await User.findOne({ username:identifier});
  if (!userexist) {
    throw new ApiError(404, "user not found");
  }
  const isPasswordvalid = await userexist.isPasswordCorrect(password);
  if (!isPasswordvalid) {
    throw new ApiError(401, "invalid password");
  }
  const { access_token, refresh_token } = await GenerateToken(userexist._id);

  const loggedinUser = await User.findById(userexist._id)
  .select(
    "-password -refreshtoken"
  );
  // console.log("this is the loggedin user", process.env.JWT_ACCESS_TOKENT_SECRET,process.env.JWT_REFRESH_TOKENT_SECRET );
  
  res
    .status(200)
    .cookie("refresh_token", refresh_token, options)
    .cookie("access_token", access_token,options)
    .json(
      new ApiResponse(
        200,
        {
          access_token,
          refresh_token,
          ...loggedinUser._doc,
        },
        "user logged in sucessfully"
      )
    );
  console.log("this we get in req", req.cookies);
});

const LogoutUser = asyncHandler(async (req, res) => {
  console.log("the user data :", req.user);
  
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshtoken: undefined,
      },
    },
    { new: true }
  );
  res
    .clearCookie("refresh_token", options)
    .clearCookie("access_token", options)
    .json(new ApiResponse(200, {}, "user logged out sucessfully"));
});

const UpdatePassword = asyncHandler(async (req, res) => {
  const { oldPaaword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);
  const Passwordchecked = await user.isPasswordCorrect(oldPaaword);
  if (!Passwordchecked) {
    throw new ApiError(401, "password is not correct");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password is changed sucessfully"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  user.password = password;
  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Password is Reset sucessfully"));
})

const GetCurrentUser = asyncHandler(async (req, res) => {
  // const user = req.user;
  const user = await User.aggregate([
    {
      $match:{_id:new mongoose.Types.ObjectId(req.user._id)}
    },
    {
      $lookup: {
        from: "connections",
        localField: "_id",
        foreignField: "following",
        as: "followers",
      }
    },
    {
      $lookup: {
        from: "connections",
        localField: "_id",
        foreignField: "follower",
        as: "followingTo",
      },
    },
    {
      $lookup:{
        from:"experiences",
        localField:"Experience",
        foreignField:"_id",
        as:"Experience",
        pipeline:[
          {
            $project:{
              title:1,
              employeetype:1,
              company_name:1,
              Location:1,
              Duration:1,
              description:1,
              role:1
            }
          }
        ]
      }
    },
    {
      $addFields: {
        followersCount: {
          $size : "$followers"
        },
        followingToCount:{
          $size:"$followingTo"
        },
        isfollwed:{
          $cond:{
            if:{$in: [req.user?._id,"$followers.follower"]},
            then:true,
            else:false,
          }
        }
      },
    },
    {
      $project:{
        fullname:1,
        username:1,
        email:1,
        avatar:1,
        coverImage:1,
        Description:1,
        role:1
      }
    }
  ])
  res.status(200).json(new ApiResponse(200, user[0], "the details of user"));
});

const GetUser = asyncHandler(async (req, res) => {
  const { username } = req.body
  if (!username) {
    throw new ApiError(404, "invalid username ji")
  }
  const user = await User.findOne({ username }).select("-password -refreshtoken")

  if (!user) {
    throw new ApiError(404, "user not found")
  }
  res
    .status(200)
    .json(new ApiResponse(200, user, "User fetch sucessfully"));
})

const updateAvatar = asyncHandler(async (req, res) => {
  console.log("my request body", req.body, req.file);
  const AvatarLocalPath = req.file.path;

  if (!AvatarLocalPath) {
    throw new ApiError(401, "the avatar image is missing");
  }
  const avatoruploaded = await uploadOncloudinary(AvatarLocalPath);
  if (!avatoruploaded.url) {
    throw new ApiError(401, "Error while uploading avatar on cloudinary");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { avatar: avatoruploaded?.url },
    },
    {
      new: true,
    },
  ).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "the user avatar has been updated"));
});



const getUserChannelProfile = asyncHandler(async (req, res) => {
  console.log(req.params);
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(401, "username is missing");
  }
  const UserPage = await User.aggregate([
    {
      $match: {
        username: username.toLowerCase()
      }
    },
    {
      $lookup: {
        from: "connections",
        localField: "_id",
        foreignField: "following",
        as: "followers",
      }
    },
    {
      $lookup: {
        from: "connections",
        localField: "_id",
        foreignField: "follower",
        as: "followingTo",
      },
    },
    {
      $lookup:{
        from:"experiences",
        localField:"Experience",
        foreignField:"_id",
        as:"Experience",
        pipeline:[
          {
            $project:{
              title:1,
              employeetype:1,
              company_name:1,
              Location:1,
              Duration:1,
              description:1,
            }
          }
        ]
      }
    },
    {
      $addFields: {
        followersCount: {
          $size : "$followers"
        },
        followingToCount:{
          $size:"$followingTo"
        },
        isfollwed:{
          $cond:{
            if:{$in: [req.user?._id,"$followers.follower"]},
            then:true,
            else:false,
          }
        }
      },
    },
    {
      $project:{
        fullname:1,
        username:1,
        email:1,
        avatar:1,
        coverImage:1,
        website:1,
        Description:1,
        Education:1,
        Experience:1,
        followersCount:1,
        followingToCount:1,
        isfollwed:1,
      }
    }
  ])

  res.
    status(200)
    .json(new ApiResponse(200, UserPage[0], "the user page has been fetched"));
});

const GenerateSalesQR = asyncHandler(async (req, res) => {
  const shopData = req.body;
  console.log("the get uo:",shopData);
  
  // check this shop is unique and not duplicate
   const shoplisted = await Shop.findOne({$or:[{"bankDetails.accountNumber": shopData.bankDetails.accountNumber},{"businessDetails.panNumber": shopData.businessDetails.panNumber}]}) 

   if(shopData.existing && shoplisted){
       // Generate QR code with referral link
      const referralLink = `${process.env.FRONTEND_DOMAIN_URL}products?referral_id=${shoplisted.referralCode}`;

      // const qrCodeImage = await QRCode.default.toBuffer(referralLink);
      const qrCodebase = await QRCode.toDataURL(referralLink);
      res.status(201).json(
        new ApiResponse(201, {
          shoplisted,
          qrCode:qrCodebase,
          referralLink
        }, "Shop created successfully with QR code")
      );
   }
   if(shoplisted){
      return res.status(401).json(new ApiError(401,"the bank account and pan card is already registered."))
   }

  // Generate a unique referral code (alphanumeric, 8 characters)
  const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

  // Add referral code to shop data
  const shopWithReferral = {
    ...shopData,
    referralCode,
    status: 'pending',
    agent: req.user._id
  };

  // Create new shop
  const shop = await Shop.create(shopWithReferral);

  if (!shop) {
    return res.status(401).json(new ApiError(500, "Failed to create shop"));
  }

  // Generate QR code with referral link
  const referralLink = `${process.env.FRONTEND_DOMAIN_URL}products?referral_id=${referralCode}`;

  // const qrCodeImage = await QRCode.default.toBuffer(referralLink);
  const qrCodebase = await QRCode.toDataURL(referralLink);
  res.status(201).json(
    new ApiResponse(201, {
      shop,
      qrCode:qrCodebase,
      referralLink
    }, "Shop created successfully with QR code")
  );
});

const NumberOfSalesConvertions = asyncHandler(async (req, res) => {
  const {id} = req.params
  if(!id){
    return res.status(400).json(new ApiError(400, "the filed cannot be empty"))
  }
  const salelinked =  await Commission.find({shop:id})

  res.status(201).json(new ApiResponse(201,salelinked,"the number of sales fetch sucessfully"))
  
});

const NumberOfReferalVisits = asyncHandler(async (req, res) => {
    console.log("this is the referal visit function");
})


export {
  RegiesterUser,
  loginUsers,
  LogoutUser,
  emailer,
  GetCurrentUser,
  UpdatePassword,
  forgotPassword,
  GetUser,
  updateAvatar,
  getUserChannelProfile,
  GenerateSalesQR,
  NumberOfSalesConvertions,
  NumberOfReferalVisits

};