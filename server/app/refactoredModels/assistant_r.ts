import mongoose, { Mongoose, Schema } from "mongoose";
import User, { IUser } from "./user_r";


export interface IAssistant extends IUser {
    module: string;
    gradDate: Date;
    gradFaculty: string;
    isAdmin: boolean;
    managingCourses: mongoose.Types.ObjectId[];
}

const AssistantSchema = new mongoose.Schema<IAssistant>({
    module: {
        type: String,
        required: true
    },
    gradDate: {
        type: Date,
        required: true
    },
    gradFaculty: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    managingCourses: {
        type: [Schema.Types.ObjectId],
        ref: 'Course',
    }
});

const Assistant = User.discriminator('Assistant', AssistantSchema);

export default Assistant;