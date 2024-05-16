import mongoose from "mongoose";
import { IStudent, StudentSchema } from "./student";

export interface IStudentEntry {
    student: IStudent;
    attendance: boolean[];
    timeSlot: Date;
    points: number[];   
}

export const StudentEntrySchema = new mongoose.Schema<IStudentEntry>({
    student: {
        type: StudentSchema,
        required: true
    },
    attendance: {
        type: [Boolean],
        required: true
    },
    timeSlot: {
        type: Date,
        required: true
    },
    points: {
        type: [Number],
        required: true
    }
});

const StudentEntry = mongoose.model<IStudentEntry>('StudentEntry',
                                                    StudentEntrySchema);

export default StudentEntry;