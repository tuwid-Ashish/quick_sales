import { Schema, model } from 'mongoose';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const AdminSchema = new Schema({
    name: { 
        type: String,
         required: true
         },
    email: { 
        type: String,
         required: true, 
         unique: true 
        },
    password: { 
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'admin' 
    },
    refreshtoken: {
        type: String,
      },
  },{timestamps:true});

AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

AdminSchema.methods.isPasswordCorrect = async function(password){
  return  await bcrypt.compare(password, this.password)
}

AdminSchema.methods.jwt_access_token = function(){
  return  jwt.sign(
    {
      _id : this._id,
      fullname :this.fullname,
      email:this.email,
      username:this.username,
    },
    process.env.JWT_ACCESS_TOKENT_SECRET,
    { 
      // algorithm: "RS256",
      expiresIn:process.env.JWT_ACCESS_TOKENT_EXPIREY_DATE
    }
  )
}

AdminSchema.methods.jwt_refresh_token = function(){
  return jwt.sign(
    {
       _id : this._id,
    },
    process.env.JWT_REFRESH_TOKENT_SECRET,
   {
    expiresIn:process.env.JWT_REFRESH_TOKENT_EXPIREY_DATE
   }
  )
}  

Admin = model('Admin', AdminSchema);
  
export default Admin