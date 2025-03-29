import { Schema, model } from 'mongoose';

const CommissionSchema = new Schema({
    shop: { 
        type: Schema.Types.ObjectId, 
        ref: 'Shop', 
        required: true 
    },
    transaction: { 
        type: Schema.Types.ObjectId, 
        ref: 'Order', 
        required: true 
    },
    commissionAmount: { 
        type: Number, 
        required: true 
    },
    status: {
        type: String, 
        enum: ['pending','rejected','approved'],
        default: 'pending'
    },
    
  },{timestamps:true});
  
export const Commission = model('Commission', CommissionSchema);
  