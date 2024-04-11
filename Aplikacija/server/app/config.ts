import dotenv from "dotenv";

dotenv.config({path: __dirname + '/.env'});

const URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@zakazi-lab-cluster.bt5bepa.mongodb.net/?retryWrites=true&w=majority&appName=Zakazi-Lab-Cluster`

export {URI};