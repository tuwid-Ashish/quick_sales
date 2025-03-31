import axios from "axios"
import type {Logindata, Orderdata, ProductFormData, QRFormData, Signdata, UpdatePassword} from "@/types"
// Create an Axios instance for API requests
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  withCredentials: true,
  timeout: 120000
})


// API functions for different actions
const loginUser = (data: Logindata) => {
  return apiClient.post("/users/login", data)
}

const registerUser = (data:Signdata) => {
  return apiClient.post("/users/signup", data)
}

const getCurrentUser = () => {
  return apiClient.get("/users/current-user")
}
const logoutUser = () => {
  return apiClient.get("/users/logout")
}

const UpdatePassword = (data:UpdatePassword) => {
  return apiClient.post("/users/change-password",data)
}

const updateAvatar = (data:string) => {
  return apiClient.post("/users/update-avatar",data)
}
const GeneratorQR = (data:QRFormData,exist:boolean) => {
  return apiClient.post("/users/generate-qr",{...data,existing:exist})
}

const Saleconverstions = (data:string) => {
  return apiClient.get(`/users/sale-converstions?${data}`,)
}

const Referalvists = (data:string) => {
  return apiClient.get(`/users/referal-vists?${data}`)
}

const AddProduct = (data:ProductFormData) => {
  return apiClient.post("/admin/add-product",data,{
    headers: {
    'Content-Type': 'multipart/form-data',
  },
})
}

const GetProducts = (offset: number, page: number) => {
  return apiClient.get(`/admin/get-products?offset=${offset}&page=${page}`)
}
const EditProduct = (data: ProductFormData) => {
  return apiClient.post("/admin/edit-product", data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
const DeleteProductById = (data: string) => {
  return apiClient.delete(`/admin/delete-product/${data}`)
}

const GetProductById = (data:string,ref?:string) => {
  return apiClient.get(`/admin/get-product/${data}?ref=${ref}`)
}

const ShipOrder = (data:string) => {
  return apiClient.post(`/admin/ship-order/${data}`)
}

const ListReferrals = () => {
  return apiClient.get("/admin/list-referrals")
}
const ApproveCommission = (data:string) => {
  return apiClient.post("/admin/approve-commission",data)
}
const RejectCommission = (data:string) => {
  return apiClient.post("/admin/reject-commission",data)
}

const GetOrderList = (offset: number, page: number,status:string)=> {
  return apiClient.get(`/admin/get-orders?offset=${offset}&page=${page}&status=${status}`)
}

const GetOrderDetails = (data:string)=>{
  return apiClient.get(`/admin/get-order/${data}`)
}

const CreateOder = (data:Orderdata)=>{
  return apiClient.post("/payment/create-order",data)
}

// const GetShopsList = (offset: number, page: number,status:string,date=)=>{
//   return apiClient.get()
// }

const GetShopById = (data:string) => {
  return apiClient.get(`/admin/get-shop/${data}`)
}
const EditShop = (data:string, body:{status:string, rate:number}) => {
  return apiClient.put(`/admin/edit-shop/${data}`, body)
}

// Export all the API functions
export {
  loginUser,
  logoutUser,
  registerUser,
  UpdatePassword,
  updateAvatar,
  GeneratorQR,
  Saleconverstions,
  Referalvists,
  AddProduct,
  GetProducts,
  EditProduct,
  DeleteProductById,
  GetProductById,
  ListReferrals,
  ApproveCommission,
  RejectCommission,
  getCurrentUser,
  GetOrderList,
  GetOrderDetails,
  CreateOder,
  ShipOrder,
  GetShopById,
  EditShop
}