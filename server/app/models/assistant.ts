import mongoose, { Mongoose, Schema } from "mongoose";
import User, { IUser } from "./user";


export interface IAssistant extends IUser {
    module: string;
    gradDate: Date;
    gradFaculty: string;
    assignedLabs: mongoose.Types.ObjectId[];
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
    assignedLabs: {
        type: [Schema.Types.ObjectId],
        ref: 'Lab',
        default: []
    }
});

const Assistant = User.discriminator('Assistant', AssistantSchema);

export default Assistant;