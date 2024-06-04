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
import loginRouter from "./routes/loginRouter";
import registerRouter from "./routes/registerRouter";

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
app.use("/classrooms", classroomRouter);
app.use("/professors", professorRouter);
app.use("/labs", labRouter);
app.use("/studentEntry", studentEntryRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);

mongoose.connect(URI)
        .then(() => {
            app.listen(process.env.SERVER_PORT, async () => {
                console.log(`Running on port ${process.env.SERVER_PORT}`);   
            })
        })
        .catch((err) => {
            console.log(err.message);
        });