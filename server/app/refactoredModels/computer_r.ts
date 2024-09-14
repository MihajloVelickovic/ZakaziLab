import mongoose, { Schema } from "mongoose";

export interface IComputer {
    name: string;
    desc: string;
    malfunctioned: boolean;
    malfunctionDesc: string;
}

export const ComputerSchema = new mongoose.Schema<IComputer>({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    malfunctioned: {
        type: Boolean,
        required: true
    },
    malfunctionDesc: {
        type: String,
        required: true
    }
});

const Computer = mongoose.model<IComputer>('Computer', ComputerSchema);

export default Computer;