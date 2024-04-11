import dotenv from "dotenv";
import path from 'path';

const envFilePath = process.platform.startsWith('win') ?
    path.join(__dirname, 'config.env') : path.join(__dirname, '/.env');


dotenv.config({path: envFilePath});

const URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@zakazi-lab-cluster.bt5bepa.mongodb.net/?retryWrites=true&w=majority&appName=Zakazi-Lab-Cluster`

//console.log(URI);

export {URI};