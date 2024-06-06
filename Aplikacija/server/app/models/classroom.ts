import mongoose, { Schema } from "mongoose";
import { IComputer } from "./computer";



export interface IClassroom extends mongoose.Document {
    name: string;
    rows: number;
    cols: number;
    computers: mongoose.Types.ObjectId[][];
}

export const ClassroomSchema = new mongoose.Schema<IClassroom>({
    name: { 
        type:String,
        required:true,
        unique: true
    },
    rows: { 
        type:Number,
        required:true 
    },
    cols: { 
        type:Number,
        required:true 
    },
    computers: {
        type: [[Schema.Types.ObjectId]],
        ref: 'Computer',
    }
});

const Classroom =  mongoose.model<IClassroom>('Classroom', ClassroomSchema);

export default Classroom;
