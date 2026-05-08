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
    bulkDiscountPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    images: {
        type: [String],
        validate: {
            validator: function(v) {
                // Accept any valid HTTP/HTTPS URL for images (Cloudinary, etc.)
                return v.every(url => /^https?:\/\/.+/.test(url));
            },
            message: props => `${props.value} is not a valid image URL!`
        }
    },
    thumbnails: {
        type: [String],
        validate: {
            validator: function(v) {
                // Accept any valid HTTP/HTTPS URL for images (Cloudinary, etc.)
                return v.every(url => /^https?:\/\/.+/.test(url));
            },
            message: props => `${props.value} is not a valid image URL!`
        }
    },
    featuredImage: {
        type: String,
        validate: {
            validator: function(v) {
                // Accept any valid HTTP/HTTPS URL for images (Cloudinary, etc.)
                return /^https?:\/\/.+/.test(v);
            },
            message: props => `${props.value} is not a valid image URL!`
        }
    }
},{timestamps:true});

const Product = model('Product', productSchema);

export default Product;