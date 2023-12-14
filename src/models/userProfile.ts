import mongoose from 'mongoose';
import User from './user';


const userProfileSchema: any = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        immutable: true,
        ref: () => User,
        required: true,
        unique: true,
    },
    age: { type: Number, min: 13, max: 150 },
    gender: {
        type: String, enum: [
            "man", "woman", "other"
        ]
    },
    profilePicture: { type: String },
    addresses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
    }],
    selectedAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
    },
    active: { type: Boolean, default: true },

});

export default mongoose.model('UserProfile', userProfileSchema);
