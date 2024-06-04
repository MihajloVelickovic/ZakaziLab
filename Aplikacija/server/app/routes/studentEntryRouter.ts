import {Router} from "express";
import lab from "../models/lab";
import Student from "../models/student";
import StudentEntry from "../models/studentEntry";
import { verify } from "jsonwebtoken";
import { authorizeToken, verifyToken } from "../config/tokenFuncs";

const studentEntryRouter = Router();

studentEntryRouter.get("/findAll", authorizeToken, async (req: any, res) => {
    
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid authentication"});
    else{
        try {
            const found = await StudentEntry.find({}).populate('student');
            if (found) 
                res.status(200).send(found);
            else 
                res.status(404).send({ message: "entry not found" }); 
        } 
        catch (err:any) {
            res.status(500).send({ message: `Error retrieving entries: ${err.message}` });
        }
    }
}); 

studentEntryRouter.post("/add", async (req, res) => {
    const {
           student, attendance, timeSlot, points, labName
        } = req.body;
   
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

studentEntryRouter.patch("/update/:id", async (req, res) => {
    const studentEntryId = req.params.id;
    const { student, attendance, timeSlot, points, labName } = req.body;

    if (!studentEntryId) {
        return res.status(400).send({ message: "Student Entry ID is required for update" });
    }

    try {
        const updateFields: any = {};
        if (student !== undefined) {
            const studentDoc = await Student.findById(student);
            if (!studentDoc) {
                return res.status(400).send({ message: `Student not found: ${student}` });
            }
            updateFields.student = student;
        }
        if (attendance !== undefined) updateFields.attendance = attendance;
        if (timeSlot !== undefined) updateFields.timeSlot = timeSlot;
        if (points !== undefined) updateFields.points = points;
        if (labName !== undefined) updateFields.labName = labName;

        const result = await StudentEntry.findByIdAndUpdate(
            studentEntryId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!result) {
            return res.status(404).send({ message: "Student Entry not found" });
        }

        res.status(200).send(result);
    } catch (err: any) {
        res.status(400).send({ message: `Error updating student entry: ${err.message}` });
    }
});

studentEntryRouter.post("/filteredFind", authorizeToken, async (req: any, res: any) => {
    
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid authentication"});
    else{
        const query = req.body;
        console.log(query);
        const labs = await StudentEntry.find(query).populate('student');
        console.log("nadjen student: ", labs);
        labs != null ?
        res.status(200).json(labs) :
        res.status(404).json({message: "labs with filter not found"});
    }
    
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