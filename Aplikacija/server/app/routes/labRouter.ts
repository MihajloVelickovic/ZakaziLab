import {Router} from "express";
import lab from "../models/lab";
import Student from "../models/student";

const labRouter = Router();

labRouter.get("/findAll", async (req, res) => {
    
    const found = await lab.find({});

    found != null ? 
    res.status(200).send(found) : 
    res.status(404).send({message: "labs not found"});

}); 

labRouter.post("/add", async (req, res) => {
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

});

labRouter.get("/filteredFind", async (req, res) => {
    const query = req.body;

    const labs = await lab.find(query);
    labs != null ?
    res.status(200).send(labs) :
    res.status(404).send({message: "labs with filter not found"});

});

labRouter.delete("/delete/:id", async (req, res) => {
    //TODO
});

export default labRouter;