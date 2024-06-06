import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import {URI} from "./config/config";
import subjectRouter from "./routes/subjectRouter";
import studentRouter from "./routes/studentRouter";
import assistantRouter from "./routes/assistantRouter";
import classroomRouter from "./routes/classroomRouter";
import professorRouter from "./routes/professorRouter";
import labRouter from "./routes/labRouter";
import studentEntryRouter from "./routes/studentEntryRouter";
import userRouter from "./routes/userRouter";
import adminRouter from "./routes/adminRouter";
import computerRouter from "./routes/computerRouter";
import classSessionRouter from "./routes/classSessionRouter";

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

app.use("/user", userRouter);
app.use("/student", studentRouter);
app.use("/subject", subjectRouter);
app.use("/assistant", assistantRouter);
app.use("/classroom", classroomRouter);
app.use("/professor", professorRouter);
app.use("/admin", adminRouter);
app.use("/lab", labRouter);
app.use("/studentEntry", studentEntryRouter);
app.use("/computer", computerRouter);
app.use("/classSession", classSessionRouter);

mongoose.connect(URI)
        .then(() => {
            app.listen(process.env.SERVER_PORT, async () => {
                console.log(`Running on port ${process.env.SERVER_PORT}`);   
            })
        })
        .catch((err) => {
            console.log(err.message);
        });