import mongoose from 'mongoose';

const addressSchema: any = new mongoose.Schema({
    city: { type: String, required: true },
    town: { type: String, required: true },
    addressLine: { type: String, required: true },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0],
            required: true
        }
    }
});

addressSchema.index({ location: '2dsphere' });

export default mongoose.model('Address', addressSchema);