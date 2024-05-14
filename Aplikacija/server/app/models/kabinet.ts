import mongoose, { Schema, Document, Mongoose} from "mongoose";

export interface IRacunar extends Document {
    naziv:string;
    uKvaru:boolean;
    opisKvara:string;
    slobodan:boolean;
}

export const RacunarSchema: Schema<IRacunar> = new mongoose.Schema({
    naziv: { 
        type: String, 
        required: true 
    },
    uKvaru: { 
        type: Boolean, 
        default: false 
    },
    opisKvara: { 
        type: String,
         default: '' 
    },
    slobodan: { 
        type: Boolean,
         default: true 
    }
});

export interface IKabinet extends Document {
    naziv:string;
    brojRacunara:number;
    brojRedova:number;
    brojKolona:number;
    racunariKabineta:IRacunar[][];
}

export const KabinetSchema: Schema<IKabinet> = new mongoose.Schema({
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
        type: [[RacunarSchema]],
        default: []
    }
});

const Kabinet =  mongoose.model<IKabinet>('Kabinet', KabinetSchema);

export default Kabinet;
