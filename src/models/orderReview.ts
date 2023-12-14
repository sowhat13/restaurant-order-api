import mongoose from "mongoose";
import RestaurantPlace from "./restaurantPlace";

const orderReviewSchema: any = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        unique: true,
    },
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
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, minlength: 0, maxlength: 200 },
}, { timestamps: true });


orderReviewSchema.post('save', async function () {
    //@ts-ignore
    const OrderReview = this.constructor;
    //@ts-ignore
    const restaurantPlaceId = this.restaurantPlaceId;

    const average = await OrderReview.aggregate([
        { $match: { restaurantPlaceId: restaurantPlaceId } },
        {
            $group: {
                _id: '$restaurantPlace',
                averageRating: { $avg: '$rating' },
            },
        },
    ]);
    if (average.length > 0) {

        await RestaurantPlace.findByIdAndUpdate(restaurantPlaceId, {
            averageRating: average[0].averageRating,
        });
    }

});

export default mongoose.model('OrderReview', orderReviewSchema);