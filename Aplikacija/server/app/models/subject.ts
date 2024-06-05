import mongoose, { Schema } from "mongoose";
import { IStudentEntry, StudentEntrySchema } from "./studentEntry";

export interface ISubject extends mongoose.Document {
    ordNum: Number;
    desc: string;
    date: Date;
    timeSlots: Date[];
    maxPoints: Number;
    lab: mongoose.Types.ObjectId;
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
    lab: {
        type: Schema.Types.ObjectId,
        ref: 'Lab'
    }
});

const Tema = mongoose.model<ISubject>('Tema', TemaSchema);

export default Tema;