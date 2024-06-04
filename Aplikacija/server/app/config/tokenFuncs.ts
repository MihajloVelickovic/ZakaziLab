import * as jwt from "jsonwebtoken"
import fs from "fs";
import path from "path";
import {Response, Request, NextFunction} from "express";

const privateKey = fs.readFileSync(path.resolve(__dirname, "../keys/key.pem"), "utf-8");
const publicKey = fs.readFileSync(path.resolve(__dirname, "../keys/key.pem.pub"), "utf-8");

function signToken(payload: any){
    return jwt.sign(payload, privateKey, {expiresIn: "1h", algorithm: "RS256"});
}

function verifyToken(token: string){
    return jwt.verify(token, publicKey, {algorithms: ["RS256"]});
}

function authorizeToken(req: any, res: Response, next: NextFunction){
    const header: any = req.headers["authorization"];

    if(typeof header === "undefined")
        res.status(403).send({message: "FORBIDDEN"});
    else{
        const bearer : any = header?.split(" ");
        if(typeof bearer === "undefined")
            res.status(403).send({message: "FORBIDDEN"});
        else{
            const token: any = bearer[1];
            req.token = token;
            next();
        }
    }
}

export {signToken, authorizeToken, verifyToken};