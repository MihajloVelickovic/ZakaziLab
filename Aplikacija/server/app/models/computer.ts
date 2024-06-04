import mongoose, { Schema } from "mongoose";
import { IStudent } from "./student";

export interface IComputer extends mongoose.Document {
    name: string;
    malfunctioned: boolean;
    malfunctionDesc: string;
    free: boolean;
    student: IStudent;
}

export const ComputerSchema = new mongoose.Schema<IComputer>({
    name: { 
        type: String, 
        required: true 
    },
    malfunctioned: { 
        type: Boolean, 
        default: false 
    },
    malfunctionDesc: { 
        type: String,
         default: '' 
    },
    free: { 
        type: Boolean,
         default: true 
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'Student'
    }
});

const Computer =  mongoose.model<IComputer>('Computer', ComputerSchema);

export default Computer;