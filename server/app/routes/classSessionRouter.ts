import { Router } from "express";
import ClassSession from "../models/classSession";
import Computer, { IComputer } from "../models/computer";
import { authorizeToken, verifyToken } from "../config/tokenFuncs";
import Classroom from "../models/classroom";

const classSessionRouter = Router();

classSessionRouter.post("/add", authorizeToken, async (req: any, res) => {
    if (!verifyToken(req.token))
        return res.status(403).send({ message: "Invalid token" });
    else {
        try {
            let { name, rows, cols, time } = req.body;

            if (!name || !rows || !cols || !time) {
                return res.status(400).json({ message: "Classroom name, rows, cols, and time are required" });
            }

            // Create computers for the classroom
            const computers: IComputer[][] = [];
            name = `${name}_${time}`;

            for (let i = 0; i < rows; ++i) {
                const rowComputers: IComputer[] = [];
                for (let j = 0; j < cols; ++j) {
                    const computer = new Computer({
                        name: `${name}_${i}_${j}`
                    });
                    
                    rowComputers.push(computer);
                }
                computers.push(rowComputers);
            }
            const classroom = new Classroom({name, rows, cols, computers});
            // Create class session
            const classSession = new ClassSession({
                classroom: classroom,
                time: time
            });

            const savedClassSession = await classSession.save();
            res.status(200).json(savedClassSession);
        } catch (err: any) {
            res.status(400).json({ message: `Error adding class session: ${err.message}` });
        }
    }
});

classSessionRouter.patch("/update/:id", authorizeToken, async (req: any, res) => {
    if (!verifyToken(req.token))
        return res.status(403).send({ message: "Invalid token" });
    else {
        try {
            const classSessionId = req.params.id;
            const { classroomName, time } = req.body;

            const updatedFields: any = {};
            if (classroomName !== undefined) updatedFields.classroom = classroomName;
            if (time !== undefined) updatedFields.time = time;

            const updatedClassSession = await ClassSession.findByIdAndUpdate(
                classSessionId,
                { $set: updatedFields },
                { new: true, runValidators: true }
            );

            if (!updatedClassSession) {
                return res.status(404).send({ message: "Class session not found" });
            }

            res.status(200).json(updatedClassSession);
        } catch (err: any) {
            res.status(400).json({ message: `Error updating class session: ${err.message}` });
        }
    }
});

classSessionRouter.get("/findAll", authorizeToken, async (req: any, res) => {
    if (!verifyToken(req.token))
        return res.status(403).send({ message: "Invalid token" });
    else {
        try {
            const classSessions = await ClassSession.find({});
            res.status(200).json(classSessions);
        } catch (err: any) {
            res.status(500).json({ message: `Error retrieving class sessions: ${err.message}` });
        }
    }
});

classSessionRouter.delete("/delete/:id", authorizeToken, async (req: any, res) => {
    if (!verifyToken(req.token))
        return res.status(403).send({ message: "Invalid token" });
    else {
        try {
            const classSessionId = req.params.id;
            const deletedClassSession = await ClassSession.findByIdAndDelete(classSessionId);

            if (!deletedClassSession) {
                return res.status(404).send({ message: "Class session not found" });
            }

            res.status(200).send({ message: `Deleted class session with id: ${classSessionId}` });
        } catch (err: any) {
            res.status(500).json({ message: `Error deleting class session: ${err.message}` });
        }
    }
});

export default classSessionRouter;
