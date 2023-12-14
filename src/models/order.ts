import mongoose from "mongoose";

const orderSchema: any = new mongoose.Schema({
    userProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserProfile',
        required: true,
    },
    restaurantPlaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RestaurantPlace',
        required: true,
    },
    items: [{
        foodId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food',
            required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
    }],
    totalPrice: { type: Number, required: true, min: 0 },
    deliveryAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true,
    },
    isDelivered: { type: Boolean, default: false },
}, { timestamps: true });



export default mongoose.model('Order', orderSchema);