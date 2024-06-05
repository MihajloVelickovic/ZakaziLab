import dotenv from "dotenv";
import path from "path";
import nm from "nodemailer";

const envFilePath = process.platform.startsWith("win") ?
                    path.join(__dirname, "../config.env") : 
                    path.join(__dirname, "../.env");

dotenv.config({path: envFilePath});

const URI = `mongodb+srv://${process.env.MONGO_USER}:` +
                           `${process.env.MONGO_PASSWORD}@` +
                           "zakazi-lab-cluster.bt5bepa.mongodb.net/?" +
                           "retryWrites=true&" +
                           "w=majority&" +
                           "appName=Zakazi-Lab-Cluster";

const emailParams: any = {
    service: process.env.SERVICE,
    email: process.env.EMAIL,
    password: process.env.PASSWORD
};

const transporer = nm.createTransport({
    service: emailParams.service,
    auth: {
        user: emailParams.email,
        pass: Buffer.from(emailParams.password, "base64").toString()
    },
    secure: false,
    port: 465,
    host: "smtp.gmail.com"
});

export {URI, emailParams, transporer};