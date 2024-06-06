import mongoose, { Schema } from "mongoose";
import { ClassSessionSchema, IClassSession } from "./classSession";

export interface ISubject extends mongoose.Document {
    ordNum: Number;
    desc: string;
    date: Date;
    sessions:IClassSession[];
    maxPoints: Number;
    lab: string;
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
    sessions: {
        type: [ClassSessionSchema],
        required:true
    },
    maxPoints: {
        type: Number,
        required:true
    },
    lab: {
        type:String,
        required:true
    }
});

const Tema = mongoose.model<ISubject>('Tema', TemaSchema);

export default Tema;