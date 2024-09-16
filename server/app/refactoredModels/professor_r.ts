import mongoose from "mongoose";
import User from "./user_r";



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