import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import {URI} from "./config";
import studentRoutes from "./routes/studentRoutes";
import Student, { IStudent } from "./models/student";


const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended:true }));

app.use('students', studentRoutes);

mongoose.connect(URI)
        .then(() => {
            app.listen(process.env.SERVER_PORT, async () => {
                console.log(`Running on port ${process.env.SERVER_PORT}`);   
            })
        })
        .catch((err) => {
            console.log(err.message);
        });

