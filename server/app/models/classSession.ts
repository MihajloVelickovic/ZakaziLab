import mongoose from "mongoose";
import { ClassroomSchema, IClassroom } from "./classroom";



export interface IClassSession extends mongoose.Document {
    classroom: IClassroom;
    time: Date;
}

export const ClassSessionSchema = new mongoose.Schema<IClassSession>({
    classroom: {
        type: ClassroomSchema,
        required:true,
    },
    time:{
        type:Date,
        reqired:true,
    }
});

const ClassSession =  mongoose.model<IClassSession>('ClassSession', ClassSessionSchema);

export default ClassSession;
