import mongoose, { Schema } from "mongoose";

// Ovo je predmet, vezuje se dalje za aktivnosti i profesore

export interface ICourse extends mongoose.Document {
    name: string;
    activityCount: number;
    mandatory: boolean;
    ESPB: number;
    courseCode: string;
    semesterNum: number;
    //spisak studenata za ceo predmet
}

export const CourseSchema = new mongoose.Schema<ICourse>({
    name: {
        type: String,
        required: true
    },
    activityCount: {
        type: Number,
        required: true,
    },
    mandatory: {
        type: Boolean,
        required: true
    },
    ESPB: {
        type: Number,
        required: true
    },
    courseCode: {
        type: String,
        required: true
    },
    semesterNum: {
        type: Number,
        required: true
    }
});

const Course = mongoose.model<ICourse>('Course', CourseSchema);

export default Course;