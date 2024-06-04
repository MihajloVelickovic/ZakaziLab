import { Router } from "express";
import Subject from "../models/subject";
import { authorizeToken, verifyToken } from "../config/tokenFuncs";

const subjectRouter = Router();

subjectRouter.post("/add", async (req, res) => {
    const { ordNum, desc, date, timeSlots, maxPoints, studentList } = req.body;

    const subject = new Subject({ 
                                    ordNum, desc, date, 
                                    timeSlots, maxPoints, studentList
                                 });

    try {
        const savedSubject = await subject.save();

        res.status(201).json(savedSubject);
    } catch (err) {
        res.status(500).json( { message: "Could not find subjects"});
    }
});

subjectRouter.get("/findAll", authorizeToken, async (req: any, res) => {
    try {
        if(!verifyToken(req.token)) 
            res.status(403).send({message: "Invalid authentication"});
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
            res.status(403).send({message: "Invalid authentication"});
        else{
            const query = req.body;
            const subject = await Subject.find(query);
            res.json(subject);
        }
    } catch (err) {
        res.status(500).json( { message: "Could not find subjects"});
    }
});

subjectRouter.delete("/delete/:id", async (req, res) => {
    try {
        const subjectId = req.params.id;

        const subject = await Subject.findByIdAndDelete(subjectId);

        if (!subject) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json({ message: "Subject deleted successfully" });
    } catch (error) {
        console.error('Error deleting subject: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default subjectRouter;