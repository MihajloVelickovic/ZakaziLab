import dotenv from "dotenv";
import path from "path";

const envFilePath = process.platform.startsWith("win") ?
                    path.join(__dirname, "config.env") : 
                    path.join(__dirname, "/.env");

dotenv.config({path: envFilePath});

const URI = `mongodb+srv://${process.env.MONGO_USER}:`+
                           `${process.env.MONGO_PASSWORD}@`+
                           "zakazi-lab-cluster.bt5bepa.mongodb.net/?"+
                           "retryWrites=true&"+
                           "w=majority&"+
                           "appName=Zakazi-Lab-Cluster";

const AZURE_CLIENT_ID = process.env.AZURE_CLIENT_ID;
const AZURE_TENANT_ID = process.env.AZURE_TENANT_ID;
const AZURE_CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET;
const AZURE_REDIRECT_URI = process.env.AZURE_REDIRECT_URI;

export {URI, AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_CLIENT_SECRET, AZURE_REDIRECT_URI};

