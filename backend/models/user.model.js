import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const userschema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is reqiured"],
    },
    avatar: {
      type: String, // cloudinary url
    },
    Description: {
      type: String,
      default: "Please tell us about yourself",
       
    },
    refreshtoken: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'agent', 'user'],
      default: 'agent' 
  },
  },
  { timestamps: true }
);


userschema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userschema.methods.isPasswordCorrect = async function(password){
  return  await bcrypt.compare(password, this.password)
}

userschema.methods.jwt_access_token = function(){
  return  jwt.sign(
    {
      _id : this._id,
      fullname :this.fullname,
      email:this.email,
      username:this.username,
    },
    process.env.JWT_ACCESS_TOKENT_SECRET,
    { 
      // algorithm: "HS256",
      expiresIn:process.env.JWT_ACCESS_TOKENT_EXPIREY_DATE || "1d"
    }
  )
}

userschema.methods.jwt_refresh_token = function(){
  return jwt.sign(
    {
       _id : this._id,
    },
    process.env.JWT_REFRESH_TOKENT_SECRET,
   {
    expiresIn:process.env.JWT_REFRESH_TOKENT_EXPIREY_DATE || "7d",
    
   }
  )
}

export const User = mongoose.model("User", userschema);