import mongoose from "mongoose";
import User, { IUser } from "./user";


export interface IAdmin extends IUser {
    FoG: boolean;
}

const AdminSchema = new mongoose.Schema<IAdmin>({
    FoG: {
        type: Boolean,
        required: true,
        immutable: true
    }
});

const Admin = User.discriminator<IAdmin>('Admin', AdminSchema);

export default Admin;