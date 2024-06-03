import mongoose from "mongoose";
export interface IUser extends mongoose.Document{
    name: string;
    lastName: string;
    email: string;
    privileges: string;
}

const UserSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    privileges: {
        type: String,
        required: true
    }
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;