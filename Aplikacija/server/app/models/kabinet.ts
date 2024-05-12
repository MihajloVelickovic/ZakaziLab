import mongoose, { Schema, Document, Mongoose} from "mongoose";
import { Racunar } from "./racunar";
import {RacunarSchema} from "./racunar";

export interface Kabinet extends Document {
    naziv:string;
    brojRacunara:number;
    brojRedova:number;
    brojKolona:number;
    racunariKabineta:Racunar[][];
}

const KabinetSchema: Schema<Kabinet> = new mongoose.Schema({
    naziv: { 
        type:String,
        required:true 
    },
    brojRacunara: {
        type:Number,
        required:true 
    },
    brojRedova: { 
        type:Number,
        required:true 
    },
    brojKolona: { 
        type:Number,
        required:true 
    },
    racunariKabineta: {
        type:[[RacunarSchema]],
        required:true
    }
});

export default mongoose.model<Kabinet>('Kabinet', KabinetSchema);