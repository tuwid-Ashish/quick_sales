import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"         
import { CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '../config/constants.js';
cloudinary.config({ 
  cloud_name:  process.env.CLOUDINARY_CLOUD_NAME || "7o6dMjmiROoA3dTE8qzQQHP9xRs", 
  api_key: process.env.CLOUDINARY_API_KEY || "237424189526748",
  api_secret: process.env.CLOUDINARY_API_SECRET || "7o6dMjmiROoA3dTE8qzQQHP9xRs"
});


async function checkCloudinary() {
    
    try {
        const result = await cloudinary.api.ping();
        console.log("✅ Cloudinary API is reachable:", result);
        cloudinary.uploader.upload("public/temp/men-women-embrace-sunset-generative-ai.jpg",{
            resource_type: "auto"
        }).then((res)=>console.log("✅ Cloudinary API is reachable:", res)
        ).catch((e=>console.log("❌ Cloudinary API is NOT reachable:", e)
        ))
        
    } catch (error) {
        console.error("❌ Cloudinary API is NOT reachable:", error.message);
    }
}

// checkCloudinary();

const uploadOncloudinary = async (loacalFilePath)=>{
    console.log(loacalFilePath);
    try {
    console.log(CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET,process.env.CLOUDINARY_CLOUD_NAME);

        if(!loacalFilePath) return null
      const respone =  await  cloudinary.uploader.upload(loacalFilePath,{
            resource_type: "auto"
        })
        console.log(`file uploaded on cloudinary : ${respone.url}`);
        fs.unlinkSync(loacalFilePath)
        return respone
    } catch (error) {
        console.log("the error we are facing: ",error);
        fs.unlinkSync(loacalFilePath)
        return null
    }
}


export {uploadOncloudinary}