
import mongoose from 'mongoose';


const restaurantGeneralSchema: any = new mongoose.Schema({

    name: { type: String, required: true, minlength: 1, maxlength: 50 },
    description: { type: String, required: true, minlength: 1, maxlength: 1000 },
    logo: { type: String, required: true },
    categories: { type: [String] },
    restaurantPlaces: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RestaurantPlace',
    }],
});

restaurantGeneralSchema.index({ description: 'text', name: 'text', categories: 'text' });

export default mongoose.model('RestaurantGeneral', restaurantGeneralSchema);