import * as jwt from "jsonwebtoken"
import fs from "fs";
import path from "path";
import {Response, Request, NextFunction} from "express";
import { TOKEN_LENGTH } from "./config";

const privateKey = fs.readFileSync(path.resolve(__dirname, "../keys/key.pem"), "utf-8");
const publicKey = fs.readFileSync(path.resolve(__dirname, "../keys/key.pem.pub"), "utf-8");
const refreshPrivateKey = fs.readFileSync(path.resolve(__dirname, "../keys/refreshkey.pem"), "utf-8");
const refreshPublicKey = fs.readFileSync(path.resolve(__dirname, "../keys/refreshkey.pem.pub"), "utf-8");


function signToken(payload: any): any;
function signToken(payload: any, expiration: string): any;

function signToken(payload: any, expiration?: string){

    let exp;
    if(typeof expiration === "undefined")
        exp = TOKEN_LENGTH;    //temporary
    else
        exp = expiration;

    return jwt.sign(payload, privateKey, {expiresIn: exp, algorithm: "RS256"});
}

function verifyToken(token: string): any;
function verifyToken(token: string, truefalse: boolean): any;

function verifyToken(token: string, truefalse? : boolean){

    let valid;
    let saveData;
    if(typeof truefalse === "undefined")
        saveData = false;
    else
        saveData = true;

    jwt.verify(token, publicKey, {algorithms: ["RS256"]}, (err, data) => {
        err ?
        valid = false :
        valid = saveData ? truefalse : data;
    });
   
    return valid;
}

function signRefresh(payload: any){
    return jwt.sign(payload, refreshPrivateKey, {expiresIn: "1h", algorithm: "RS256"});
}

function verifyRefresh(token: string){
    
    let result;
    jwt.verify(token, refreshPublicKey, {algorithms: ["RS256"]}, (err, data) => {
        err ?
        result = false :
        result = data
    });

    return result;
}


function authorizeToken(req: any, res: Response, next: NextFunction){
    const header: any = req.headers["authorization"];

    if(typeof header === "undefined")
        res.status(403).send({message: "Authorization header not found"});
    else{
        const bearer : any = header?.split(" ");
        if(typeof bearer === "undefined" || bearer[0] !== "Bearer")
            res.status(403).send({message: "Bearer token not found"});
        else{
            const token: any = bearer[1];
            req.token = token;
            next();
        }
    }
}

export {signToken, authorizeToken, verifyToken, signRefresh, verifyRefresh};