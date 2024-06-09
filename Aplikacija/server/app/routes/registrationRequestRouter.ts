import {Router} from "express";
import RegistrationRequest from "../models/registrationRequest";
import { authorizeToken, verifyToken } from "../config/tokenFuncs";


const registrationRequestRouter = Router();

registrationRequestRouter.get("/findAll", authorizeToken, async (req: any, res) => {
    
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid token"});
    else {
        const found = await RegistrationRequest.find({},{_id:0, token: 1});
        found != null ? 
        res.status(200).send(found) : 
        res.status(404).send({message: "professors not found"});
    }
}); 

export default registrationRequestRouter;