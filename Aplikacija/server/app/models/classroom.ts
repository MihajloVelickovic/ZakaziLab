import mongoose, { Schema } from "mongoose";
import { ComputerSchema, IComputer } from "./computer";



export interface IClassroom extends mongoose.Document {
    name: string;
    rows: number;
    cols: number;
    computers: IComputer[][];
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
        type: [[ComputerSchema]]
    }
});

const Classroom =  mongoose.model<IClassroom>('Classroom', ClassroomSchema);

export default Classroom;
