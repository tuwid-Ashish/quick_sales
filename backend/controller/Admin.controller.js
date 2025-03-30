import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import Product from "../models/products.model.js";
import Order from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { Commission } from "../models/Commission.model.js";
import { uploadOncloudinary } from "../utils/Cloudinary.js";
import Shop from "../models/shop.model.js";
import { processCommission } from "./payment.controller.js";


const AddSaleProduct = asyncHandler(async (req,res)=>{
    try {
        if(req.user.role !== "admin"){
            throw new ApiError(403,"You are not authorized to perform this action")
        }
        console.log("my body",req.body,req.files);
        const poductImages = req.files.map(img=>img?.path)
        const body = Object.assign({}, req.body);

        // ✅ Validate required fields exist
        const requiredFields = ["name", "price","description" ,"category", "stock"];
        const missingFields = requiredFields.filter(field => !body[field]);

        if (missingFields.length > 0) {
            throw new ApiError(400, `Missing required fields: ${missingFields.join(", ")}`);
        }

        const {name,price,description,category,stock} = body
        
        const cloudinaryImages = [];
        for (const upImg of poductImages) {
            const result = await uploadOncloudinary(upImg);
            cloudinaryImages.push(result.url);
        }

        const product = new Product({
            name,
            price,
            description,
            category,
            stock,
            images:cloudinaryImages
        })
        await product.save()
        console.log("the product",product);
        
        return res
        .status(200)
        .json(new ApiResponse(200,product, "the product create successfully"));
    } catch (error) {
        console.log(error);
        return res.status(400).json(new ApiError(400,error))
        
    }
})

const EditSaleProduct = asyncHandler(async (req, res) => {
    console.log("Raw Body:", req.body);
    console.log("Raw Files:", req.files);

    const body = { ...req.body };
    const productImages = req.files?.map(img => img?.path) || [];

    // ✅ Ensure all required fields exist
    const requiredFields = ["name", "price", "description", "category", "stock", "_id"];
    const missingFields = requiredFields.filter(field => 
        body[field] === undefined || body[field] === null || body[field] === ""
    );

    if (missingFields.length > 0) {
        console.error("Missing Fields:", missingFields);
        return res.status(400).json(new ApiError(400, `Missing required fields: ${missingFields.join(", ")}`));
    }

    try {
        console.log("Validated Body:", body);
        
        const { name, price, description, category, stock, _id, existingImages } = body;

        // ✅ Upload new images to Cloudinary
        const cloudinaryimages = await Promise.all(
            productImages.map(async (upImg) => {
                const result = await uploadOncloudinary(upImg);
                return result.url; // Ensure we're getting only URLs
            })
        );

        console.log("the data of existing image is we are senting:",existingImages);
        

        // ✅ Ensure existing images are always an array
        const finalImages = Array.isArray(existingImages) ? cloudinaryimages.concat(existingImages) : cloudinaryimages;

        // ✅ Fetch product from DB
        const product = await Product.findById(_id);
        if (!product) {
            console.error("Product Not Found:", _id);
            return res.status(404).json(new ApiError(404, "Product not found"));
        }

        console.log("Product Found:", product);

        // ✅ Update product fields
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.category = category || product.category;
        product.stock = stock || product.stock;
        product.images = finalImages;

        await product.save();

        // ✅ Return success response
        return res.status(200).json(new ApiResponse(200, {
            message: "Product updated successfully",
            product
        }));

    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
});


const DeleteSaleProduct = asyncHandler(async (req,res)=>{
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if(!product){
            return res.status(404).json(new ApiError(404,"Product not found"))
        }
        await product.deleteOne()
        return res
        .status(200)
        .json( new ApiResponse(200,
            {
               message:"Product deleted successfully",
                product
            }))
 
    } catch (error) {
        return res.status(400).json(new ApiError(400,error))
    }
})


const GetSaleProducts = asyncHandler(async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const products = await Product.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalProducts = await Product.countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);

        return res.status(200).json(
            new ApiResponse(200, {
                products,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalProducts,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            })
        );
    } catch (error) {
        return res.status(400).json(new ApiError(400,error))
    }
});

const GetSaleProductById= asyncHandler(async (req,res)=>{
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if(!product){
            throw new ApiError(404,"Product not found")
        }
        return res
        .status(200)
        .json(new ApiResponse(200,product))
    } catch (error) {
        return res.status(400).json(new ApiError(400,error))
    }
})

const ListReferrals = asyncHandler(async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            throw new ApiError(403, "You are not authorized to perform this action");
        }

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filter options
        const filter = {};
        
        // Add status filter if provided
        if (req.query.status) {
            filter.status = req.query.status;
        }

        // Add date filter if provided
        if (req.query.date) {
            const startDate = new Date(req.query.date);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 1);
            filter.createdAt = {
                $gte: startDate,
                $lt: endDate
            };
        }

        // Add search filter if provided
        if (req.query.search) {
            filter.$or = [
                { 'shop.name': { $regex: req.query.search, $options: 'i' } },
                { 'shop.contactPerson': { $regex: req.query.search, $options: 'i' } }
            ];
        }
        
        // Fetch commissions with populated data
        const commissions = await Commission.find(filter)
            .populate({
                path: 'shop',
                select: 'name contactPerson bankDetails businessDetails'
            })
            .populate({
                path: 'transaction',
                select: 'totalAmount customer orderDate products paymentStatus'
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const totalCommissions = await Commission.countDocuments(filter);
        const totalPages = Math.ceil(totalCommissions / limit);

        return res.status(200).json(
            new ApiResponse(200, {
                commissions,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCommissions,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            })
        );
    } catch (error) {
        return res.status(400).json(new ApiError(400, error));
    }
});

const ApproveCommission = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    // Authorization check
    if (req.user.role !== "admin") {
      throw new ApiError(403, "You are not authorized to perform this action");
    }
  
    // Find the commission document
    const commission = await Commission.findById(id);
    if (!commission) {
      throw new ApiError(404, "Commission not found");
    }

    // Process the commission payout
    let payout;
    try {
      payout = await processCommission(commission._id);
    } catch (error) {
      console.error("Error initiating payout:", error);
      throw new ApiError(500, "Payout initiation failed");
    }
  
    if (!payout) {
      throw new ApiError(500, "Payout initiation failed");
    }
    
    // Update commission status to approved and save
    commission.status = "approved";
    await commission.save();

    // Return successful response with commission and payout details
    return res.status(200).json(new ApiResponse(200, {
      message: "Commission approved successfully",
      commission,
      payout,
    }));
  });
  
  const RejectCommission = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    // Authorization check
    if (req.user.role !== "admin") {
      throw new ApiError(403, "You are not authorized to perform this action");
    }
  
    // Find the commission document
    const commission = await Commission.findById(id);
    if (!commission) {
      throw new ApiError(404, "Commission not found");
    }
  
    // Update commission status to rejected and save
    commission.status = "rejected";
    await commission.save();
  
    // Return a successful rejection response
    return res.status(200).json(new ApiResponse(200, {
      message: "Commission rejected successfully",
      commission,
    }));
  });
  
const GetOrders = asyncHandler(async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json(new ApiError(403, "You are not authorized to perform this action"));
        }

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filtering options
        const filter = {};
        if (req.query.paymentStatus) {
            filter.paymentStatus = req.query.paymentStatus;
        }
        if (req.query.customerName) {
            filter["customer.name"] = { $regex: req.query.customerName, $options: "i" }; // Case-insensitive search
        }
        if (req.query.orderDate) {
            const start = new Date(req.query.orderDate);
            const end = new Date(start);
            end.setDate(start.getDate() + 1);
            filter.orderDate = { $gte: start, $lt: end };
        }

        // Fetch orders with filters, sorting, and pagination
        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("products.product", "name price") // Populate product details
            .populate("shop", "name email"); // Populate agent details

        // Get total count for pagination metadata
        const totalOrders = await Order.countDocuments(filter);
        const totalPages = Math.ceil(totalOrders / limit);

        return res.status(200).json(
            new ApiResponse(200, {
                orders,
                pagination: {
                    totalOrders,
                    totalPages,
                    currentPage: page,
                    perPage: limit
                }
            })
        );
    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
});



const GetOrderById = asyncHandler(async (req,res)=>{
    try {
        // if(req.user.role !== "admin"){
        //     throw new ApiError(403,"You are not authorized to perform this action")
        // }
        const { id } = req.params;
        
        const order = await Order.findById(id)
            .populate({
            path: 'products.product',
            select: 'name description images price category'
            })
            .populate('shop', 'fullname email phone')
        if(!order){
            throw new ApiError(404,"Order not found")
        }   
        return res.status(200).json(new ApiResponse(200,order))

    } catch (error) {
        throw new ApiError(400,error)
    }
}
)
const ShipOrder = asyncHandler(async (req,res)=>{
     if(req.user.role !== "admin"){
        return res.status(403).json(new ApiError(403,"You are not authorized to perform this action"))
        }
        const { id } = req.params;
        const order = await Order.findById(id)
        if(!order){
            return res.status(403).json(new ApiError(404,"Order not found"))
        }

        order.shipped = true
        await order.save({ validateBeforeSave: false });
        return res.status(200).json({success: true ,message:"the product is on shipping mode"})

})

const GetShopsList = asyncHandler(async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json(
                new ApiError(403, "You are not authorized to perform this action")
            );
        }

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build filter object
        const filter = {};

        // Filter by agent if provided
        if (req.query.agentId) {
            filter.agent = req.query.agentId;
        }

        // Filter by date range if provided
        if (req.query.startDate) {
            const start =  new Date(req.query.startDate)
            filter.createdAt = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate ||start )
            };
        }

        console.log("the filter date data id :",filter.createdAt);
        

        // Get shops with pagination and populate agent details
        const shops = await Shop.find(filter)
            .populate('agent', 'username email phone _id')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const totalShops = await Shop.countDocuments(filter);
        const totalPages = Math.ceil(totalShops / limit);

        // Get all agents for filtering options
        const agents = await User.find({ role: "agent" })
            .select('_id username email');

        return res.status(200).json(
            new ApiResponse(200, {
                shops,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalShops,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                },
                filterOptions: {
                    agents
                }
            })
        );
    } catch (error) {
        console.error("Error in GetShopsList:", error);
        return res.status(500).json(
            new ApiError(500, "Error fetching shops list")
        );
    }
});
 

const EditShop = asyncHandler(async (req,res)=>{
    if(req.user.role !== "admin"){
        return res.status(403).json(new ApiError(403,"You are not authorized to perform this action"))
    }
    const { id } = req.params;
    console.log("the req data", id , req.body);
    
    try {
        const agents = await Shop.findById(id);
        if(!agents){
            return res.status(404).json(new ApiError(404,"Agent not found"))
        }
        const {status,rate} = req.body
        if (rate && (typeof rate !== 'number' || rate > 50)) {
            return res.status(401).json(new ApiError(401,"Commission rate must be a number and cannot be more than 50%"))
        }
        if(status == "rejected"){
            agents.isActive = false 
        }

        agents.commissionRate = rate || agents.commissionRate   
        agents.status = status || agents.status

        await agents.save({validateBeforeSave:false})
        return res.status(200).json(new ApiResponse(200,{
            message:"Agent updated successfully",
            agents
        }))
        
    } catch (error) {
        return res.status(400).json(new ApiError(400, error.message || "Error updating shop")) 
    }
}
)

const GetshopById = asyncHandler(async(req,res)=>{
    try {
        const { id } = req.params;
        console.log("the shop id",id);
        
        const agents = await Shop.findById(id)
        console.log(agents);
        
        // .populate('agent', 'username email _id')

        if(!agents){
          console.log("the shop id",id);
          return res.json(new ApiError(404,"Agent not found"))
        }
        return res.status(201).json(new ApiResponse(200,agents))
    } catch (error) {
        throw new ApiError(400,error)
    }
}
)
export {
    AddSaleProduct,
    EditSaleProduct,
    DeleteSaleProduct,
    GetSaleProducts,
    GetSaleProductById,
    ListReferrals,
    ApproveCommission,
    GetOrders,
    RejectCommission,
    GetOrderById,
    GetShopsList,
    EditShop,
    GetshopById,
    ShipOrder
}