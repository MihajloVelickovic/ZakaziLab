import mongoose, { Schema, Document, Mongoose} from "mongoose";

export interface Racunar extends Document {
    naziv:string;
    uKvaru:boolean;
    opisKvara:string;
    slobodan:boolean;
}

export const RacunarSchema: Schema<Racunar> = new mongoose.Schema({
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

export default mongoose.model<Racunar>('Racunar', RacunarSchema);