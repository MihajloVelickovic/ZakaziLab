import mongoose from "mongoose";
import User, { IUser } from "./user";


export interface IStudent extends IUser {
    birthDate: Date;
    index: number;
    module: string;
}

export const StudentSchema = new mongoose.Schema<IStudent>({
    birthDate: {
        type: Date,
        required: true
    },
    index: {
        type: Number,
        required: true
    },
    module: {
        type: String,
        required:true
    }
});

const Student = User.discriminator<IStudent>('Student', StudentSchema);

export default Student;