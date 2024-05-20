import mongoose from "mongoose";
import User, { IUser } from "./user";


export interface IAssistant extends IUser {
    module: string;
    gradDate: Date;
    gradFaculty: string;
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
    }
});

const Assistant = User.discriminator('Assistant', AssistantSchema);

export default Assistant;