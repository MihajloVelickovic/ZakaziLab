import mongoose from "mongoose";

export interface IComputer extends Document {
    name: string;
    malfunctioned: boolean;
    malfunctionDesc: string;
    free: boolean;
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
    }
});

export interface IClassroom extends Document {
    name: string;
    computerNum: number;
    rows: number;
    cols: number;
    computers: IComputer[][];
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
        type: [[ComputerSchema]],
        default: []
    }
});

const Classroom =  mongoose.model<IClassroom>('Classroom', ClassroomSchema);

export default Classroom;
