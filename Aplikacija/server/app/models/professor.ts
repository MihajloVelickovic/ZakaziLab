import mongoose from "mongoose";
import { IAssistant } from "./Assistant";
import User from "./user";



export interface IProfessor extends IAssistant {
    phdGradDate: Date;
    phdGradFaculty: string;
}

const ProfessorSchema = new mongoose.Schema<IProfessor>({
    phdGradDate: {
        type: Date,
        required: true
    },
    phdGradFaculty: {
        type: String,
        required: true
    }
});

const Professor = User.discriminator('Professor', ProfessorSchema);

export default Professor;