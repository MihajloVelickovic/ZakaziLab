import mongoose, { Schema } from "mongoose";
import { IStudent } from "./student";


export interface IStudentEntry {
    student: mongoose.Types.ObjectId;
    attendance: boolean[];
    timeSlot: Date;
    points: number[];  
    labName: string; 
}

export const StudentEntrySchema = new mongoose.Schema<IStudentEntry>({
    student: { 
        type: Schema.Types.ObjectId,
        ref: 'Student'
    },
    attendance: {
        type: [Boolean],
        required: true
    },
    points: {
        type: [Number],
        required: true
    },
    labName: {
        type: String,
        required: true
    }
});

const StudentEntry = mongoose.model<IStudentEntry>('StudentEntry',
                                                    StudentEntrySchema);

export default StudentEntry;