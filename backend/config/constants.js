import dotenv from 'dotenv';   
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
export const JWT_SECRET = process.env.JWT_SECRET 
export const RAZERPAY_KEY_ID = process.env.RAZERPAY_API_KEY
export const RAZERPAY_KEY_SECRET = process.env.RAZERPAY_API_KEY_SECRET
export const CLOUD_NAME=  process.env.CLOUDINARY_CLOUD_NAME
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY 
export  const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET 
export const DB_NAME = "quicksales"
export const DOMAIN_URL = process.env.FRONTEND_DOMAIN_URL
export const INVENTRY_URL = process.env.INVENTRY_URL

