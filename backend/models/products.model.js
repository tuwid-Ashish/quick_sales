import { Schema, model } from 'mongoose';

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: true,
        default: "quick", 
        trim: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    images: {
        type: [String],
        validate: {
            validator: function(v) {
                return v.every(url => /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(url));
            },
            message: props => `${props.value} is not a valid image URL!`
        }
    },
},{timestamps:true});

const Product = model('Product', productSchema);

export default Product;