import {Router} from "express";
import lab from "../models/lab";
import Student from "../models/student";
import Lab from "../models/lab";
import { authorizeToken, verifyToken } from "../config/tokenFuncs";
import Tema from "../models/subject";
import mongoose from "mongoose";
import Classroom from "../models/classroom";

const labRouter = Router();

labRouter.get("/findAll", authorizeToken, async (req: any, res) => {
    
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid token"});
    else{
        const found = await lab.find({});
        found != null ? 
        res.status(200).send(found) : 
        res.status(404).send({message: "labs not found"});
    }

}); 

labRouter.post("/add", authorizeToken, async (req:any, res) => {
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid token"});
    
    else {
        let { labName, desc, mandatory, subjectNum, maxPoints, classroom, rows, cols, crName,
             subjects, studentList, dates, timeSlots, subjectDescs} = req.body;

        try {

            const currentYear = new Date().getFullYear();
            const nextYear = currentYear + 1;

            const name = `${labName}_${currentYear}/${nextYear}`;
            try {
                if (!Array.isArray(subjects)) {
                    return res.status(400).send({ error: 'Subjects must be an array' });
                }
                 
                // O(n^4) ??!?!?!?!!??!?!!??!!?!?!? !!!!
                for(let i=0;i<subjectNum;++i) {
                    for(let j=0;j < timeSlots.length;++j) {
                        for(let k=0; rows;++k) {
                            for(let l=0;l<cols;++l) {
                                
                            }
                        }
                    }
                }



                const newLab: any = new Lab({
                    name,
                    desc,
                    mandatory,
                    subjectNum,
                    maxPoints,
                    classroom,
                    subjects,
                    studentList,
                });
        
                await newLab.save();
        
                res.status(201).send(newLab);
            } 
            catch (error:any) {
                res.status(400).send({ error: error.message });
            }
        } catch (error:any) {
            res.status(400).send({ error: error.message });
        }
    }
});

labRouter.post("/filteredFind", authorizeToken, async (req: any, res) => {
   
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid token"});
    else{
        const query = req.body;
        const labs = await lab.find(query).populate('classroom') 
                                          .populate('subjects')  
                                          .populate('studentList'); 
        labs != null ?
        res.status(200).send(labs) :
        res.status(404).send({message: "labs with filter not found"});
    }
});

labRouter.patch("/update/:id", authorizeToken,async (req:any, res) => {
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid token"});

    else {
        const labId = req.params.id;
        const { name, desc, mandatory, subjectNum, maxPoints, studentList, timeSlots, subjects } = req.body;
    
        if (!labId) {
            return res.status(400).send({ message: "Lab ID is required for update" });
        }
    
        try {
            const updateFields: any = {}; // Partial<ILab> ensures that only optional fields are allowed
            if (name !== undefined) updateFields.name = name;
            if (desc !== undefined) updateFields.desc = desc;
            if (mandatory !== undefined) updateFields.mandatory = mandatory;
            if (subjectNum !== undefined) updateFields.subjectNum = subjectNum;
            if (maxPoints !== undefined) updateFields.maxPoints = maxPoints;
            if (studentList !== undefined) updateFields.studentList = studentList;
            if (timeSlots !== undefined) updateFields.timeSlots = timeSlots;
    
            // Handle subjects separately if needed
    
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
        res.status(403).send({message: "Invalid token"});

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