import mongoose, { Schema } from "mongoose";
import { IClassroom } from "./classroom_t";

// Potrebno dodati teme, odnosno prvi, drugi.... lab
//svaki ce da sadrzi session

export interface IActivity extends mongoose.Document {

}

export const ActivitySchema = new mongoose.Schema<IActivity> ({

});

const Activity = mongoose.model<IActivity>('Activity', ActivitySchema);

export default Activity;