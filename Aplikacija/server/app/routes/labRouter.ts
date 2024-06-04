import {Router} from "express";
import lab from "../models/lab";
import Student from "../models/student";
import Lab from "../models/lab";
import { authorizeToken, verifyToken } from "../config/tokenFuncs";

const labRouter = Router();

labRouter.get("/findAll", authorizeToken, async (req: any, res) => {
    
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid authentication"});
    else{
        const found = await lab.find({});
        found != null ? 
        res.status(200).send(found) : 
        res.status(404).send({message: "labs not found"});
    }

}); 

labRouter.post("/add", authorizeToken, async (req:any, res) => {
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid authentication"});
    
    else {
        const {
                name, desc, mandatory, subjectNum, maxPoints, studentList
            } = req.body;
        const ast = new lab({
                                name, desc, mandatory, 
                                subjectNum, maxPoints, studentList
                            });
        
        try{
            const result = await ast.save();
            res.status(200).send(result);
        }
        catch(err: any){
            res.status(400).send({message: `Error adding lab:
            ${err.message}`});
        }
    }
});

labRouter.post("/filteredFind", authorizeToken, async (req: any, res) => {
   
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid authentication"});
    else{
        const query = req.body;
        const labs = await lab.find(query);
        labs != null ?
        res.status(200).send(labs) :
        res.status(404).send({message: "labs with filter not found"});
    }
});

labRouter.patch("/update/:id", authorizeToken,async (req:any, res) => {
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid authentication"});

    else {
        const labId = req.params.id;
        const {
            name, desc, mandatory, subjectNum, maxPoints, studentList
        } = req.body;
    
        if (!labId) {
            return res.status(400).send({ message: "Lab ID is required for update" });
        }
    
        try {
            const updateFields: any = {};
            if (name !== undefined) updateFields.name = name;
            if (desc !== undefined) updateFields.desc = desc;
            if (mandatory !== undefined) updateFields.mandatory = mandatory;
            if (subjectNum !== undefined) updateFields.subjectNum = subjectNum;
            if (maxPoints !== undefined) updateFields.maxPoints = maxPoints;
            if (studentList !== undefined) updateFields.studentList = studentList;
    
            const result = await Lab.findByIdAndUpdate(
                labId,
                { $set: updateFields },
                { new: true, runValidators: true }
            );
    
            if (!result) {
                return res.status(404).send({ message: "Lab not found" });
            }
    
            res.status(200).send(result);
        } catch (err: any) {
            res.status(400).send({ message: `Error updating lab: ${err.message}` });
        }
    }
});

labRouter.delete("/delete/:id", authorizeToken, async (req:any, res) => {
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid authentication"});

    else {
        try{
            const {id} = req.params;
            const entry = await Lab.findByIdAndDelete(id);
            entry != null ?
            res.status(200).send({message: `Deleted Lab with id: ${id}`}) :
            res.status(404).send({message: `No Lab with id: ${id} found`});
            
        }
        catch(err: any){
            console.log(err.message);
            return res.status(500).send({message: "Internal Server Error"});
        }
    }
});

export default labRouter;