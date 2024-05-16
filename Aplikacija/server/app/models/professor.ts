import mongoose from "mongoose";
import Assistent, { IAssistent } from "./assistent";


export interface IProfessor extends IAssistent {
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