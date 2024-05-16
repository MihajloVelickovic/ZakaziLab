import mongoose from "mongoose";
import User, { IUser } from "./user";


export interface IAssistent extends IUser {
    module: string;
    gradDate: Date;
    gradFaculty: string;
}

const AssistentSchema = new mongoose.Schema<IAssistent>({
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

const Assistent = User.discriminator('Assistent', AssistentSchema);

export default Assistent;