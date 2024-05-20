import mongoose from "mongoose";
import { IStudentEntry, StudentEntrySchema } from "./studentEntry";

export interface ISubject extends mongoose.Document {
    ordNum: Number;
    desc: string;
    date: Date;
    timeSlots: Date[];
    maxPoints: Number;
    studentList: IStudentEntry[];
}

export const TemaSchema = new mongoose.Schema<ISubject>({
    ordNum: {
        type: Number,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required:true
    },
    timeSlots: {
        type: [Date],
        required:true
    },
    maxPoints: {
        type: Number,
        required:true
    },
    studentList: {
        type: [StudentEntrySchema],
        required:true
    }
});

const Tema = mongoose.model<ISubject>('Tema', TemaSchema);

export default Tema;