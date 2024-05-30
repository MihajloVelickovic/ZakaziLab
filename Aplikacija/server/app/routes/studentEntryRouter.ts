import {Router} from "express";
import lab from "../models/lab";
import Student from "../models/student";
import StudentEntry from "../models/studentEntry";

const studentEntryRouter = Router();

studentEntryRouter.get("/findAll", async (req, res) => {
    
    const found = await StudentEntry.find({});

    found != null ? 
    res.status(200).send(found) : 
    res.status(404).send({message: "entry not found"});

}); 

studentEntryRouter.post("/add", async (req, res) => {
    const {
           student, attendance, timeSlot, points, labName
        } = req.body;
    const ast = new StudentEntry({
                            student, attendance,
                            timeSlot, points, labName
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

studentEntryRouter.get("/filteredFind", async (req, res) => {
    const query = req.body;

    const labs = await StudentEntry.find(query);
    labs != null ?
    res.status(200).send(labs) :
    res.status(404).send({message: "labs with filter not found"});

});

studentEntryRouter.delete("/delete/:id", async (req, res) => {
    //TODO
});

export default studentEntryRouter;