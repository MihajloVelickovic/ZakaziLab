import mongoose, { Schema } from "mongoose";


export interface IStudentEntry {
    student: mongoose.Types.ObjectId;
    session: mongoose.Types.ObjectId;
    computer: mongoose.Types.ObjectId;
    points: number;
    comment: string;
}

export const StudentEntrySchema = new mongoose.Schema<IStudentEntry>({
    student: { 
        type: Schema.Types.ObjectId,
        ref: 'Student'
    },
    comment: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    session: {
        type: Schema.Types.ObjectId,
        ref: 'Session'
    }
});

const StudentEntry = mongoose.model<IStudentEntry>('StudentEntry',
                                                    StudentEntrySchema);

export default StudentEntry;