
import { Router } from "express";
import Classroom from "../models/classroom";
import { authorizeToken, verifyToken } from "../config/tokenFuncs";

const classroomRouter = Router();

classroomRouter.post("/add", authorizeToken, async (req:any, res) => {
    if (!verifyToken(req.token))
        return res.status(403).send({ message: "Invalid authentication" });
    else {
        const { name, computerNum, rows, cols, computers } = req.body;
    
        try {
            // Validate computers matrix
            if (!Array.isArray(computers) || !computers.every(row => Array.isArray(row))) {
                return res.status(400).json({ message: "Invalid format for computers matrix" });
            }
    
            const classroom = new Classroom({
                name,
                computerNum,
                rows,
                cols,
                computers
            });
    
            const savedClassroom = await classroom.save();
            res.status(200).json(savedClassroom);
        } catch (err: any) {
            res.status(400).json({ message: `Error adding classroom: ${err.message}` });
        }
    }
});

classroomRouter.patch("/update/:id", authorizeToken, async (req:any, res) => {
    const classroomId = req.params.id;
    const { name, computerNum, rows, cols, computers } = req.body;

    if (!classroomId) {
        return res.status(400).send({ message: "Classroom ID is required for update" });
    }
    else {
        try {
            const updateFields: any = {};
            if (name !== undefined) updateFields.name = name;
            if (computerNum !== undefined) updateFields.computerNum = computerNum;
            if (rows !== undefined) updateFields.rows = rows;
            if (cols !== undefined) updateFields.cols = cols;
            if (computers !== undefined) {
                // Validate computers matrix
                if (!Array.isArray(computers) || !computers.every(row => Array.isArray(row))) {
                    return res.status(400).json({ message: "Invalid format for computers matrix" });
                }
                updateFields.computers = computers;
            }
    
            const result = await Classroom.findByIdAndUpdate(
                classroomId,
                { $set: updateFields },
                { new: true, runValidators: true }
            );
    
            if (!result) {
                return res.status(404).send({ message: "Classroom not found" });
            }
    
            res.status(200).json(result);
        } catch (err: any) {
            res.status(400).json({ message: `Error updating classroom: ${err.message}` });
        }
    }
});

classroomRouter.get("/findAll", authorizeToken, async (req: any, res) => {
    if (!verifyToken(req.token)) {
        return res.status(403).send({ message: "Invalid authentication" });
    }
    else {
        try {
            const classrooms = await Classroom.find({}).populate({
                path: 'computers',
                populate: {
                    path: 'student'
                }
            });
    
            if (classrooms.length > 0) {
                res.status(200).json(classrooms);
            } else {
                res.status(400).json({ message: "Could not find classrooms" });
            }
        } catch (err: any) {
            res.status(500).json({ message: `Error retrieving classrooms: ${err.message}` });
        }
    }   
});

classroomRouter.post("/filteredFind", authorizeToken, async (req: any, res) => {
    if (!verifyToken(req.token))
        return res.status(403).send({ message: "Invalid authentication" });
    else {
        try {
            const query = req.body;
    
            const classrooms = await Classroom.find(query).populate({
                path: 'computers',
                populate: {
                    path: 'student'
                }
            });
    
            if (classrooms.length > 0) {
                res.status(200).json(classrooms);
            } else {
                res.status(400).json({ message: "Could not find matching classrooms" });
            }
        } catch (err: any) {
            res.status(500).json({ message: `Error retrieving classrooms: ${err.message}` });
        }
    } 
});

classroomRouter.delete("/delete/:id", authorizeToken, async (req:any, res) => {
    if (!verifyToken(req.token))
        return res.status(403).send({ message: "Invalid authentication" });
    else {
        try {
            const { id } = req.params;
            const entry = await Classroom.findByIdAndDelete(id);
    
            if (entry) {
                res.status(200).send({ message: `Deleted Classroom with id: ${id}` });
            } else {
                res.status(404).send({ message: `No Classroom with id: ${id} found` });
            }
        } catch (err: any) {
            console.log(err.message);
            return res.status(500).send({ message: "Internal Server Error" });
        }
    } 
});

export default classroomRouter;