import mongoose from "mongoose";
import { IComputer } from "./computer";



export interface IClassroom extends mongoose.Document {
    name: string;
    computerNum: number;
    rows: number;
    cols: number;
    computers: mongoose.Types.ObjectId[][];
}

export const ClassroomSchema = new mongoose.Schema<IClassroom>({
    name: { 
        type:String,
        required:true 
    },
    computerNum: {
        type:Number,
        required:true 
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
        type: [[mongoose.Types.ObjectId]],
        ref: 'Computer',
        default: []
    }
});

const Classroom =  mongoose.model<IClassroom>('Classroom', ClassroomSchema);

export default Classroom;
