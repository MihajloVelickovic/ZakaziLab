import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import {URI} from "./config"

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(URI)
        .then(() => {
            app.listen(process.env.SERVER_PORT, () => {
                console.log(`Running on port ${process.env.SERVER_PORT}`);
            })
        })
        .catch((err) => {
            console.log(err.message);
        });