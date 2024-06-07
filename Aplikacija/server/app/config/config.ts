import dotenv from "dotenv";
import path from "path";
import nm from "nodemailer";

const envFilePath = process.platform.startsWith("win") ?
                    path.join(__dirname, "../config.env") : 
                    path.join(__dirname, "../.env");

dotenv.config({path: envFilePath});

const URI = `mongodb+srv://${process.env.MONGO_USER}:` +
                           `${Buffer.from(process.env.MONGO_PASSWORD!, "base64").toString()}@` +
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

const strongPassword: RegExp =  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;"'<>,.?/~`-])(?=.*\d)[A-Za-z\d!@#$%^&*()_+{}\[\]:;"'<>,.?/~`-]{8,}$/;

const TOKEN_LENGTH = process.env.TOKEN_LENGTH;



const VALID_DOMAINS = [
                        [process.env.STUDENT_DOMAINS!.split(",")],
                        [process.env.PROFESSOR_DOMAINS!.split(",")]
                      ];

export {URI, emailParams, transporer, strongPassword, TOKEN_LENGTH, VALID_DOMAINS};