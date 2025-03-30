import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
  customer: {
    name: { type: String },
    phoneNumber: { type: String },
    email: { type: String},
  },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true,default:1 },
      priceAtPurchase: { type: Number, required: true }, // to record the price at the time of purchase
      name:{type: String}
    },
  ],
  totalAmount: { 
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  
  shippingAddress:{type:String},

  orderDate: { 
    type: Date,
    default: Date.now
  },

  referralCode: {
    type: String,
  },   // optional, if a referral is used
  
  shop: {
    type: Schema.Types.ObjectId,
    ref: "Shop"
  },  

  paymentDetails: {
    razorpayPaymentId: {type: String},
    verificationStatus: {type: String},
    error: {type: String},
    captureResponse: {type: Schema.Types.Mixed},
},
  shipped:{
    type:Boolean,
    default:false,
  }
});

const Order = model("Order", orderSchema);
export default Order;