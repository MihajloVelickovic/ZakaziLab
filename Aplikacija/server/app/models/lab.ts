import mongoose, { mongo } from "mongoose";
import { IStudentEntry, StudentEntrySchema } from "./studentEntry";

export interface ILab extends mongoose.Document{
    name: string;
    desc: string;
    mandatory: boolean;
    subjectNum: number;
    maxPoints: number;
    studentList: IStudentEntry[];
}

export const LabScheme = new mongoose.Schema<ILab> ({
    name: {
        type: String,
        required:true
    },
    desc: {
        type: String,
        required:true
    },
    mandatory: {
        type: Boolean,
        required:true
    },
    subjectNum: {
        type: Number,
        required:true
    },
    maxPoints: {
        type: Number,
        required:true
    },
    studentList: {
        type: [StudentEntrySchema],
        required: true
    }
 });

const Lab = mongoose.model<ILab>('Lab', LabScheme);

export default Lab;