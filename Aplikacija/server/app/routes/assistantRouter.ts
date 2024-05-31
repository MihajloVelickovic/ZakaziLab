import {Router} from "express";
import Assistant from "../models/assistant";
import Student from "../models/student";

const assistantRouter = Router();

assistantRouter.get("/findAll", async (req, res) => {
    
    const found = await Assistant.find({});

    found != null ? 
    res.status(200).send(found) : 
    res.status(404).send({message: "Assistants not found"});

}); 

assistantRouter.post("/add", async (req, res) => {
    const {
            name, lastName, email,
            privileges, module, gradDate, gradFaculty
        } = req.body;
    const ast = new Assistant({
                                name, lastName, email,
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

assistantRouter.post("/filteredFind", async (req, res) => {
    const query = req.body;

    const assistants = await Assistant.find(query);
    assistants != null ?
    res.status(200).send(assistants) :
    res.status(404).send({message: "Assistants with filter not found"});

});

assistantRouter.delete("/delete/:id", async (req, res) => {
    //TODO
});

export default assistantRouter;