import mongoose from "mongoose";
import Assistent, { IAssistant } from "./assistant";


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

const Professor = Assistent.discriminator('Professor', ProfessorSchema);

export default Professor;