import { Router } from "express";
import Subject from "../models/subject";
import { authorizeToken, verifyToken } from "../config/tokenFuncs";

const subjectRouter = Router();

subjectRouter.post("/add", async (req, res) => {
    const { ordNum, desc, date, sessions, maxPoints, studentList } = req.body;

    const subject = new Subject({ 
                                    ordNum, desc, date, 
                                    sessions, maxPoints, studentList
                                 });

    try {
        const savedSubject = await subject.save();

        res.status(201).json(savedSubject);
    } catch (err) {
        res.status(500).json({ message: "Could not find subjects"});
    }
});

subjectRouter.patch("/update/:id", authorizeToken, async (req:any, res) => {
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid token"});
    else {
        const subjectId = req.params.id;
        const { ordNum, desc, date, sessions, maxPoints, studentList } = req.body;

        if (!subjectId) {
            return res.status(400).send({ message: "Subject ID is required for update" });
        }

        try {
                const updateFields: any = {};
                if (ordNum !== undefined) updateFields.ordNum = ordNum;
                if (desc !== undefined) updateFields.desc = desc;
                if (date !== undefined) updateFields.date = date;
                if (sessions !== undefined) updateFields.sessions = sessions;
                if (maxPoints !== undefined) updateFields.maxPoints = maxPoints;
                if (studentList !== undefined) updateFields.studentList = studentList;

                const result = await Subject.findByIdAndUpdate(
                    subjectId,
                    { $set: updateFields },
                    { new: true, runValidators: true }
                );

                if (!result) {
                    return res.status(404).send({ message: "Subject not found" });
                }

                res.status(200).json(result);
            } catch (err:any) {
                res.status(500).json({ message: `Error updating subject: ${err.message}` });
            }
    }
});

subjectRouter.get("/findAll", authorizeToken, async (req: any, res) => {
    try {
        if(!verifyToken(req.token))
            res.status(403).send({message: "Invalid token"});
        else{
            const subjects = await Subject.find({});
            res.json(subjects);
        }
    } catch (err) {
        res.status(500).json( { message: "Could not find subjects"});
    }
});

subjectRouter.post("/filteredFind", authorizeToken, async (req: any, res) => {
    try {
        if(!verifyToken(req.token)) 
            res.status(403).send({message: "Invalid token"});
        else{
            const query = req.body;
            const subject = await Subject.find(query).populate('lab');
            res.json(subject);
        }
    } catch (err) {
        res.status(500).json( { message: "Could not find subjects"});
    }
});

subjectRouter.delete("/delete/:id", authorizeToken, async (req:any, res) => {
    try {
        if(!verifyToken(req.token)) 
            res.status(403).send({message: "Invalid token"});
        else {
            const subjectId = req.params.id;

        const subject = await Subject.findByIdAndDelete(subjectId);

        if (!subject) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json({ message: "Subject deleted successfully" });
        }        
    } catch (error) {
        console.error('Error deleting subject: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default subjectRouter;