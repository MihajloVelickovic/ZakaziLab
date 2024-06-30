import {Router} from "express";
import Admin from "../models/admin";
import { authorizeToken, verifyToken } from "../config/tokenFuncs";

const adminRouter = Router();

adminRouter.get("/findAll", authorizeToken, async (req: any, res) => {
    
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid token"});
    else {       
        const found = await Admin.find({});

        found != null ? 
        res.status(200).send(found) : 
        res.status(404).send({message: "Admins not found"});
    }
}); 

adminRouter.post("/add", authorizeToken,async (req:any, res) => {
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid token"});
    else {
        const {
            name, lastName, email, password,
            privileges, FoG
        } = req.body;
        const ast = new Admin({
                                    name, lastName, email, password,
                                    privileges, FoG
                                });
        
        try{
            const result = await ast.save();
            res.status(200).send(result);
        }
        catch(err: any){
            res.status(400).send({message: `Error adding Admin:
            ${err.message}`});
        }
    }

});

adminRouter.patch("/update/:id", authorizeToken,async (req:any, res) => {
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid token"});
    else {
        const adminId = req.params.id;
        const updateData = req.body;
    
        try {
            const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updateData, { new: true });
    
            if (!updatedAdmin) {
                return res.status(404).send({ message: "Admin not found" });
            }
    
            res.status(200).send(updatedAdmin);
        } catch (err: any) {
            res.status(400).send({ message: `Error updating Admin: ${err.message}` });
        }
    }
});

adminRouter.post("/filteredFind", authorizeToken, async (req: any, res) => {
    
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid token"});
    else {
        const query = req.body;

        const Admins = await Admin.find(query);
        Admins != null ?
        res.status(200).send(Admins) :
        res.status(404).send({message: "Admins with filter not found"});
    }
});

adminRouter.delete("/delete/:id", authorizeToken, async (req:any, res) => {
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid token"});
    else {
        try{
            const {id} = req.params;
            const entry = await Admin.findByIdAndDelete(id);
            entry != null ?
            res.status(200).send({message: `Deleted Admin with id: ${id}`}) :
            res.status(404).send({message: `No Admin with id: ${id} found`});
            
        }
        catch(err: any){
            console.log(err.message);
            return res.status(500).send({message: "Internal Server Error"});
        }
    }
});

export default adminRouter;