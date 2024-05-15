import mongoose, { Schema, Document, Mongoose} from "mongoose";

export interface ITema extends Document{
    redniBroj: Number;
    opis: string;
    datumOdrzavanja: Date;
    termini: Date[];
    maxPoeni: Number;
}

export const TemaSchema: Schema<ITema> = new mongoose.Schema({
    redniBroj: {
        type: Number,
        required: true
    },
    opis: {
        type: String,
        required: true
    },
    datumOdrzavanja: {
        type: Date,
        required:true
    },
    termini: {
        type: [Date],
        required:true
    },
    maxPoeni: {
        type: Number,
        required:true
    }
});

const Tema = mongoose.model<ITema>('Tema', TemaSchema);

export default Tema;