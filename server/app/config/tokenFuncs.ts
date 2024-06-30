import * as jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { Response, Request, NextFunction } from "express";
import { TOKEN_LENGTH } from "./config";

const privateKey = fs.readFileSync(path.resolve(__dirname, "../keys/key.pem"), "utf-8");
const publicKey = fs.readFileSync(path.resolve(__dirname, "../keys/key.pem.pub"), "utf-8");
const refreshPrivateKey = fs.readFileSync(path.resolve(__dirname, "../keys/refreshkey.pem"), "utf-8");
const refreshPublicKey = fs.readFileSync(path.resolve(__dirname, "../keys/refreshkey.pem.pub"), "utf-8");

function signToken(payload: any, expiration?: string, infinite?: boolean) {
    let exp;
    if (typeof infinite !== "undefined" && infinite === true) {
        return jwt.sign(payload, privateKey, { algorithm: "RS256" });
    }

    exp = typeof expiration === "undefined" ? TOKEN_LENGTH : expiration;

    return jwt.sign(payload, privateKey, { expiresIn: exp, algorithm: "RS256" });
}

function verifyToken(token: string, truefalse?: boolean) {
    try {
        const data = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
        return typeof truefalse === "undefined" ? data : truefalse;
    } catch (err) {
        return false;
    }
}

function signRefresh(payload: any) {
    return jwt.sign(payload, refreshPrivateKey, { expiresIn: "1h", algorithm: "RS256" });
}

function verifyRefresh(token: string) {
    try {
        return jwt.verify(token, refreshPublicKey, { algorithms: ["RS256"] });
    } catch (err) {
        return false;
    }
}

function authorizeToken(req: any, res: Response, next: NextFunction) {
    const header: any = req.headers["authorization"];

    if (typeof header === "undefined") {
        res.status(403).send({ message: "Authorization header not found" });
    } else {
        const bearer: any = header.split(" ");
        if (typeof bearer === "undefined" || bearer[0] !== "Bearer") {
            res.status(403).send({ message: "Bearer token not found" });
        } else {
            const token: any = bearer[1];
            req.token = token;
            next();
        }
    }
}

export { signToken, authorizeToken, verifyToken, signRefresh, verifyRefresh };
