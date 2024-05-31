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
    // const ast = new StudentEntry({
    //                         student, attendance,
    //                         timeSlot, points, labName
    //                     });
    
    try{
        let studentDoc = await Student.findById(student);

        if (!studentDoc) {
            res.status(400).send({ message: `Student not found: ${student}` });
            return;
        }

        const studentEntry = new StudentEntry({
            student, attendance, timeSlot, points, labName
        });


        const result = await studentEntry.save();
        res.status(200).send(result);
    }
    catch(err: any){
        res.status(400).send({message: `Error adding lab:
         ${err.message}`});
    }

});

studentEntryRouter.post("/filteredFind", async (req, res) => {
    const query = req.body;

    const labs = await StudentEntry.find(query);
    labs != null ?
    res.status(200).send(labs) :
    res.status(404).send({message: "labs with filter not found"});

});

studentEntryRouter.delete("/delete/:id", async (req, res) => {
    try{
        const {id} = req.params;
        const entry = await StudentEntry.findByIdAndDelete(id);
        entry != null ?
        res.status(200).send({message: `Deleted studentEntry with id: ${id}`}) :
        res.status(404).send({message: `No studentEntry with id: ${id} found`});
        
    }
    catch(err: any){
        console.log(err.message);
        return res.status(500).send({message: "Internal Server Error"});
    }
});

export default studentEntryRouter;