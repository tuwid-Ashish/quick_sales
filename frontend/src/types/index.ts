import { z } from "zod";

export interface User {
    _id?: string;
    role?: string;
    username?: string;
    email?: string,
    Description?: string,
    // Add other user properties as needed
}

export interface Logindata{
    username: string;
    password: string;
  }
  
 
export interface UpdatePassword{
    confirmpassword: string;
    password: string;
  }
  
 
export interface Signdata{
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
}

export interface ProductFormData {
  _id:string;
  existingImages?: string[];
  name: string;
  price: number;
  description?: string;
  category: string;
  stock: number;
  images: string[];
}

export interface Orderdata{
  id: string|undefined;
  name: string;
  phone:string;
  email:string;
  referral:string| null;
  address:string

}
  
 

export interface ContactPerson {
  name: string;
  phone: string;
  email: string;
}

export interface BankDetails {
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  bankName: string;
}

export interface BusinessDetails {
  panNumber: string;
  businessType: "individual" | "partnership" | "company";
  gstNumber?: string;
  registrationNumber?: string;
}

export interface Location {
  coordinates: [number, number];
}

export interface QRFormData {
  name: string;
  contactPerson: ContactPerson;
  bankDetails: BankDetails;
  businessDetails: BusinessDetails;
  location: Location;
  commissionRate: number;
}

export interface ProductImage {
  id: string;
  url: string;
  file?: File;
  isExisting: boolean;
}

// import {z} from ""
export const formSchema = z.object({
name: z.string().min(2),
contactPerson: z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
}),
bankDetails: z.object({
  accountNumber: z.string().min(9),
  ifscCode: z.string().min(11),
  accountHolderName: z.string().min(2),
  bankName: z.string().min(2),
}),
businessDetails: z.object({
  panNumber: z.string().min(10),
  businessType: z.enum(["individual", "partnership", "company"]),
  gstNumber: z.string().optional(),
  registrationNumber: z.string().optional(),
}),
location: z.object({
  coordinates: z.array(z.number()).length(2),
}),
commissionRate: z.string()
.transform((value) => parseFloat(value))
.refine((value) => !isNaN(value) && value >= 5, {
  message: "Commission rate must be a number greater than or equal to 5",
}),
});