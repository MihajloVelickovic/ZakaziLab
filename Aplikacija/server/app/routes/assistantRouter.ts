import {Router} from "express";
import Assistant from "../models/assistant";
import { authorizeToken, verifyToken } from "../config/tokenFuncs";


const assistantRouter = Router();

assistantRouter.get("/findAll", authorizeToken, async (req: any, res) => {
    
    if(!verifyToken(req.token)) 
        return res.status(403).send({message: "Invalid token"});
    
    const found = await Assistant.find({}).populate('assignedLabs');

    found != null ? 
    res.status(200).send(found) : 
    res.status(404).send({message: "Assistants not found"});

}); 

assistantRouter.post("/add", authorizeToken,async (req:any, res) => {
    let data;
    if(!(data = verifyToken(req.token))) 
        return res.status(403).send({message: "Invalid token"});

    const {
            name, lastName, email, password,
            privileges, module, gradDate, gradFaculty
        } = req.body;
    const ast = new Assistant({
                                name, lastName, email, password,
                                privileges, module, gradDate, gradFaculty
                            });
    
    try{
        const result = await ast.save();
        res.status(200).send(result);
    }
    catch(err: any){
        res.status(400).send({message: `Error adding assistant:
         ${err.message}`});
    }

});

assistantRouter.patch("/update/:id", authorizeToken, async (req:any, res) => {
    if(!verifyToken(req.token)) 
        return res.status(403).send({message: "Invalid token"});
    const assistantId = req.params.id;
    const {
        name, lastName, email, password,
        privileges, module, gradDate, gradFaculty, assignedLabs
    } = req.body;

    if (!assistantId) {
        return res.status(400).send({ message: "Assistant ID is required for update" });
    }

    try {
        const updateFields: any = {};
        if (name !== undefined) updateFields.name = name;
        if (lastName !== undefined) updateFields.lastName = lastName;
        if (email !== undefined) updateFields.email = email;
        if (password !== undefined) updateFields.password = password;
        if (privileges !== undefined) updateFields.privileges = privileges;
        if (module !== undefined) updateFields.module = module;
        if (gradDate !== undefined) updateFields.gradDate = gradDate;
        if (gradFaculty !== undefined) updateFields.gradFaculty = gradFaculty;
        if(assignedLabs !== undefined) updateFields.assignedLabs = assignedLabs;

        const result = await Assistant.findByIdAndUpdate(
            assistantId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!result) {
            return res.status(404).send({ message: "Assistant not found" });
        }

        res.status(200).send(result);
    } catch (err: any) {
        res.status(400).send({ message: `Error updating assistant: ${err.message}` });
    }
});

assistantRouter.post("/filteredFind", authorizeToken, async (req: any, res) => {
    
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid token"});
    else{
        const query = req.body;
        const assistants = await Assistant.find(query).populate('assignedLabs');
        assistants != null ?
        res.status(200).send(assistants) :
        res.status(404).send({message: "Assistants with filter not found"});
    }
});

assistantRouter.delete("/delete/:id", authorizeToken,async (req:any, res) => {
    let data;
    if(!(data = verifyToken(req.token))) 
        return res.status(403).send({message: "Invalid token"});
    try{
        const {id} = req.params;
        const entry = await Assistant.findByIdAndDelete(id);
        entry != null ?
        res.status(200).send({message: `Deleted Assistant with id: ${id}`}) :
        res.status(404).send({message: `No Assistant with id: ${id} found`});
        
    }
    catch(err: any){
        console.log(err.message);
        return res.status(500).send({message: "Internal Server Error"});
    }
});

export default assistantRouter;