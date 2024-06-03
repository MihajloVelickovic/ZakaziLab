import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import {URI} from "./config";
import subjectRouter from "./routes/subjectRouter";
import studentRouter from "./routes/studentRouter";
import assistantRouter from "./routes/assistantRouter";
import classroomRouter from "./routes/classroomRouter";
import professorRouter from "./routes/professorRouter";
import labRouter from "./routes/labRouter";
import studentEntryRouter from "./routes/studentEntryRouter";
import userRouter from "./routes/userRouter";
import loginRouter from "./routes/login";
import registerRouter from "./routes/register";

const corsOptions = {
    origin: 'http://localhost:3000', // Your client URL
    optionsSuccessStatus: 200,
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
// app.use(cors(
//     {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//         allowedHeaders: ["X-Requested-With", "content-type"]
//     }));
    
// app.use(express.urlencoded({ extended:true }));

// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     // res.setHeader('Access-Control-Allow-Credentials');
//     next();
// });
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

