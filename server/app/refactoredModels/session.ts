import mongoose, { Schema } from "mongoose";
import { IClassroom } from "./classroom_t";

//razmotriti da se podeli na dve klase umesto da bude ovako
// imam jos jedno potencialno resenje, da postoji kolokvijum i lab
// i da sadrze aktivnosti, mozda treba da se promeni ime ali sustina je ista

export interface ISession extends mongoose.Document {
    desc: string;
    mandatory: boolean;
    points: number;
    duration: number; // u minutima
    startTime: Date;
    classroom: IClassroom; //kabineti gde se odrzavaju labovi
    course:  mongoose.Types.ObjectId;
    //spisak studenata za aktivnost
    //potencijalno i nije neophodno ali treba testirati
}

export const SessionSchema = new mongoose.Schema<ISession> ({
    desc: {
        type: String,
        required:true
    },
    mandatory: {
        type: Boolean,
        required:true
    },
    points: {
        type: Number,
        required:true
    },
    duration: {
        type: Number,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
    },
    classroom: {
        type: Schema.Types.ObjectId,
        ref: 'Classroom'
    }
});

const Activity = mongoose.model<ISession>('Session', SessionSchema);

export default Activity;