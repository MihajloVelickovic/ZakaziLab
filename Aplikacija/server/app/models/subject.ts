import mongoose from "mongoose";

export interface ISubject extends Document{
    ordNum: Number;
    desc: string;
    date: Date;
    timeSlots: Date[];
    maxPoints: Number;
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
    }
});

const Tema = mongoose.model<ISubject>('Tema', TemaSchema);

export default Tema;