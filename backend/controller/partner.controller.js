import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import Product from "../models/products.model.js";
import Order from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { Commission } from "../models/Commission.model.js";
import { uploadOncloudinary } from "../utils/Cloudinary.js";


const AddSaleProduct = asyncHandler(async (req,res)=>{
    try {
        if(req.user.role !== "agent"){
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
        throw new ApiError(400, error);
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
        throw new ApiError(400,error)
    }
})

const ListReferrals = asyncHandler((req,res)=>{
    try {
        if(req.user.role !== "admin"){
            throw new ApiError(403,"You are not authorized to perform this action")
        }
        const dispatch = Commission.find({status:"pending"}).sort({createdAt:-1})
        
        return new ApiResponse(200,dispatch)
    } catch (error) {
        throw new ApiError(400,error)
    }
})

const ApproveCommission = asyncHandler(async (req,res)=>{
    try {
        const { id } = req.params;
        if(req.user.role !== "admin"){
            throw new ApiError(403,"You are not authorized to perform this action")
        }
        const commission = await Commission
        .findById(id)
        if(!commission){
            throw new ApiError(404,"Commission not found")
        }
        commission.status = "approved"
        // ReleaseFunds(commission) method from payment gateway 
    } catch (error) {
        
    }
})

const RejectCommission = asyncHandler(async (req,res)=>{
    try {
        if(req.user.role !== "admin"){
            throw new ApiError(403,"You are not authorized to perform this action")
        }
        const { id } = req.params;
        const commission = await Commission
        .findById(id)
        if(!commission){
            throw new ApiError(404,"Commission not found")
        }
        commission.status = "rejected"

        await commission.save()
        return new ApiResponse(200,{
            message:"Commission rejected successfully",
            commission
        })
    } catch (error) {
        throw new ApiError(400,error)
    }
}
)


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
            .populate("agent", "name email"); // Populate agent details

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

export default GetOrders;


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
            .populate('agent', 'fullname email phone')
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


const GetAgentList = asyncHandler(async (req,res)=>{
    try {
        if(req.user.role !== "admin"){
            throw new ApiError(403,"You are not authorized to perform this action")
        }
        const agents = await User.find({role:"agent"}).select("-password -refreshtoken").sort({createdAt:-1})
        return new ApiResponse(200,agents)
    } catch (error) {
        throw new ApiError(400,error)
    }
}
)

const EditAgent = asyncHandler(async (req,res)=>{
    if(req.user.role !== "admin"){
        throw new ApiError(403,"You are not authorized to perform this action")
    }
    const { id } = req.params;
    try {
        const agents = await User.findById(id);
        if(!agents){
            throw new ApiError(404,"Agent not found")
        }
        const {fullname,email,username,phone,role} = req.body
        agents.fullname = fullname || agents.fullname   
        agents.email = email || agents.email
        agents.username = username || agents.username
        agents.phone = phone || agents.phone
        agents.role = role || agents.role
        await agents.save()
        return new ApiResponse(200,{
            message:"Agent updated successfully",
            agents
        })
        
    } catch (error) {
       throw new ApiError(400,error) 
    }
}
)

const GetAgentById = asyncHandler(async(req,res)=>{
    try {
        const { id } = req.params;
        const agents = await User.findById(id).select("-password -refreshtoken")
        if(!agents){
            throw new ApiError(404,"Agent not found")
        }
        return new ApiResponse(200,agents)
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
    GetAgentList,
    EditAgent,
    GetAgentById,
    ShipOrder
    
}