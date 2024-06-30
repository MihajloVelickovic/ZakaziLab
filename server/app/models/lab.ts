import mongoose, { Schema, mongo } from "mongoose";
import { IStudentEntry, StudentEntrySchema } from "./studentEntry";
import { IClassroom } from "./classroom";

export interface ILab extends mongoose.Document{
    name: string;
    desc: string;
    mandatory: boolean;
    subjectNum: number;
    maxPoints: number;
    studentList: mongoose.Types.ObjectId[];
    classroom: mongoose.Types.ObjectId;
    subjects: mongoose.Types.ObjectId[];
    timeSlots: Date[];   
}

export const LabScheme = new mongoose.Schema<ILab> ({
    name: {
        type: String,
        required:true,
        unique:true
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
    classroom: {
        type: Schema.Types.ObjectId,
        ref: 'Classroom',
    },
    subjects: {
        type: [Schema.Types.ObjectId],
        ref: 'Tema',
    },
    studentList: {
        type: [Schema.Types.ObjectId],
        ref: 'StudentEntry',
    }
 });

const Lab = mongoose.model<ILab>('Lab', LabScheme);

export default Lab;