import mongoose from "mongoose";


const foodSchema: any = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    restaurantPlace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RestaurantPlace',
        required: true,
    },
    price: { type: Number, required: true },
    picture: { type: String, required: true },
    active: { type: Boolean, default: true },
});

export default mongoose.model('Food', foodSchema);