import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    googleId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        googleId: { type: String },
    },
    { timestamps: true }
);

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;