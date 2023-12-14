import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import autopopulate from 'mongoose-autopopulate';


const userSchema: any = new mongoose.Schema(
    {
        username: {
            type: String,
            required: 'Username is required',
            unique: 'Username already exists',
            lowercase: true,
            trim: true,
            minlength: [4, 'Username must be at least 4 characters long'],
            maxlength: [30, 'Username must be at most 30 characters long'],
        } as any,
        password: {
            type: String,
            required: 'Password is required',
            match: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
            select: false,
        } as any,
        role: {
            type: String,
            enum: ['costumer','seller', 'admin'],
            default: 'costumer',
        } as any,
    },
    {
        timestamps: true,
    },
);
userSchema.plugin(autopopulate);

userSchema.pre('save', async function (next: any) {
    try {
        // check method of registration
        //@ts-ignore
        const user = this;
        if (!user.isModified('password')) next(); // generate salt
        const salt = await bcrypt.genSalt(10); // hash the password
        //@ts-ignore

        const hashedPassword = await bcrypt.hash(this.password, salt);
        // replace plain text password with hashed password
        //@ts-ignore

        this.password = hashedPassword;
        return next();
    } catch (error) {
        return next(error);
    }
});

userSchema.methods.matchPassword = async function (password: string) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error: any) {
        throw new Error(error);
    }
};
const User: any = mongoose.model('User', userSchema)
export default User;
