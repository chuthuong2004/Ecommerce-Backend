import mongoose, { Types } from "mongoose";
import bcrypt from "bcrypt";
import config from "config"
import { stdSerializers } from "pino";

export interface UserDocument extends mongoose.Document {
    email: string;
    username: string;
    password: string;
    isAdmin: boolean;
    avatar?: string;
    cart?: Types.ObjectId;
    orders?: Types.ObjectId[];
    addresses?: Address[];
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export interface Address extends mongoose.Document {
    firstName: string;
    lastName: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    address: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String, required: true,
    },
    password: {
        type: String, required: true,
    },
    addresses: {
        type: Array<Address>,
    }
}, {timestamps: true});

// Used for logging in 
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    const user = this as UserDocument
    return bcrypt.compare(candidatePassword, user.password).catch((e)=> false)
}


UserSchema.pre('save', async function (next: any) {
    let user = this as UserDocument

    // only hash the password if it has been modified (or is new)
    if(!user.isModified('password')) return next()

    // Random additional data
    const salt = await bcrypt.genSalt(config.get('saltWorkFactor'))
    const hash = await bcrypt.hashSync(user.password, salt)

    // Replace the password with the hash
    user.password = hash
    return next()
})

const User = mongoose.model<UserDocument>('User', UserSchema);
export default User;