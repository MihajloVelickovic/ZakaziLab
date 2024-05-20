import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import {URI} from "./config";
import studentRoutes from "./routes/studentRouter";
import Student, { IStudent } from "./models/student";
import subjectRouter from "./routes/subjectRouter";
import studentRouter from "./routes/studentRouter";
import assistantRouter from "./routes/assistantRoute";


const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended:true }));

app.use('/student', studentRouter);
app.use('/subject', subjectRouter);
app.use("/assistant", assistantRouter);

mongoose.connect(URI)
        .then(() => {
            app.listen(process.env.SERVER_PORT, async () => {
                console.log(`Running on port ${process.env.SERVER_PORT}`);   
            })
        })
        .catch((err) => {
            console.log(err.message);
        });

