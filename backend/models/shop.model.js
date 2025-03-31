import { Schema, model } from 'mongoose';

const shopSchema = new Schema({
  agent:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  name: { 
    type: String, 
    required: true
 },
  location: {
    type: { 
        type: String, 
        enum: ['Point'], 
        default: 'Point' 
    },
    coordinates: { 
        type: [Number], 
        required: true 
    } // [longitude, latitude]
  },
  qrCode: { 
    type: String, 
 },
bankDetails: {
  accountNumber: { type: String, required: true },
  ifscCode: { type: String, required: true },
  accountHolderName: { type: String, required: true },
  bankName: { type: String, required: true }
},
businessDetails: {
  gstNumber: { type: String},
  panNumber: { type: String, required: true },
  businessType: { type: String, enum: ['individual', 'partnership', 'company'] },
  registrationNumber: { type: String }
},
status: {
  type: String,
  enum: ['pending', 'approved', 'rejected'],
  default: 'pending'
},
referralCode: { 
  type: String, 
  unique: true,  
},
commissionRate: {
  type: Number,
  required: true,
  default: 0
},
contactPerson: {
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true }
},
 vistors: {
  type:Number,

},
// documents: {
//   panCard: { type: String },
//   gstCertificate: { type: String },
//   bankStatement: { type: String }
// },
isActive: {
  type: Boolean,
  default: true
},

},{timestamps:true});

shopSchema.index({ location: '2dsphere' }); // For geospatial queries

const Shop = model('Shop', shopSchema);
export default Shop;
