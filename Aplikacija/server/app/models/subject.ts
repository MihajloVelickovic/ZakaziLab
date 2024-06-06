import mongoose, { Schema } from "mongoose";
import { ClassSessionSchema, IClassSession } from "./classSession";

export interface ISubject extends mongoose.Document {
    ordNum: Number;
    desc: string;
    date: Date;
    sessions:IClassSession[];
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
    sessions: {
        type: [ClassSessionSchema],
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