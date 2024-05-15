import mongoose, { Schema, Document, Mongoose} from "mongoose";

//dodati stavkuSpiskaStudenata

export interface ILaboratorijskaVezba extends Document{
    naziv: string;
    opis: string;
    obavezna: boolean;
    brojTema: number;
    maxBrojPoena: number;
}

export const LaboratorijskaVezbaSchema:
 Schema<ILaboratorijskaVezba> = new mongoose.Schema ({
    naziv: {
        type: String,
        required:true
    },
    opis: {
        type: String,
        required:true
    },
    obavezna: {
        type: Boolean,
        required:true
    },
    brojTema: {
        type: Number,
        required:true
    },
    maxBrojPoena: {
        type: Number,
        required:true
    }
 });

 const LaboratorijskaVezba = mongoose.model<ILaboratorijskaVezba>(
    'LaboratorijskaVezba', LaboratorijskaVezbaSchema);

export default LaboratorijskaVezba;