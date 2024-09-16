import mongoose from "mongoose";
import User, { IUser } from "./user_r";
import { ICourse } from "./course_r";


export interface IStudent extends IUser {
    birthDate: Date;
    index: number;
    module: string;
    courses: ICourse[];
}

export const StudentSchema = new mongoose.Schema<IStudent>({
    birthDate: {
        type: Date,
        required: true
    },
    index: {
        type: Number,
        required: true,
        unique: true
    },
    module: {
        type: String,
        required:true
    }
});

const Student = User.discriminator<IStudent>('Student', StudentSchema);

export default Student;