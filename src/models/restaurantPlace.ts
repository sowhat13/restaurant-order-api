
import mongoose from 'mongoose';


const restaurantPlaceSchema: any = new mongoose.Schema({

    restaurantGeneral: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RestaurantGeneral",
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
    },
    menu: {
        type: [
            {
                categoryName: { type: String, required: true, minlength: 1, maxlength: 20 },
                categoryDescription: { type: String, },
                coverPicture: { type: String, },
                foods: [{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Food",
                }]
            }
        ],
        required: true,
        default: []
    },

    averageRating: { type: Number, default: 0, min: 0, max: 5, required: true },

});


export default mongoose.model('RestaurantPlace', restaurantPlaceSchema);