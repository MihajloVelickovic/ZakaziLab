import mongoose, { Schema } from "mongoose";

export interface IClassroom extends mongoose.Document {
    name: string;
    rows: number;
    columns: number;
    desc: string;
    computers: mongoose.Types.ObjectId[][];
}

export const ClassroomSchema = new mongoose.Schema<IClassroom> ({
    name: {
        type: String,
        required:true,
        unique:true
    },
    desc: {
        type: String,
        required:true
    },
    rows: {
        type: Number,
        required:true
    },
    columns: {
        type: Number,
        required:true
    },
    computers: {
        type: [[Schema.Types.ObjectId]],
        ref: 'Computer',
    }
});

const Classroom = mongoose.model<IClassroom>('Classroom', ClassroomSchema);

export default Classroom;