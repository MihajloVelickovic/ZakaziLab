
import { Router } from "express";
import Classroom from "../models/classroom";
import { authorizeToken, verifyToken } from "../config/tokenFuncs";
import Computer, { IComputer } from "../models/computer";
import mongoose, { Schema } from "mongoose";

const classroomRouter = Router();

classroomRouter.post("/add", authorizeToken, async (req:any, res) => {
    if (!verifyToken(req.token))
        return res.status(403).send({ message: "Invalid token" });
    else {
        const { name, rows, cols } = req.body;
    
        try {
            
            const computers: IComputer[][] = [];

            for(let i=0; i<rows; ++i){
                const iterComputers: IComputer[] = [];
                const dbComputers: any[] = []
                for(let j=0; j<cols; ++j){
                    const computerToAdd = new Computer({name: `${name}_${i}_${j}`})
                    dbComputers.push(computerToAdd);
                    iterComputers.push(computerToAdd);
                }
                computers.push(iterComputers);
                /*try{
                    await Computer.insertMany(dbComputers);
                } ???????
                catch(err: any){
                    console.log(`${err.message}`);
                }*/
            }
            if(computers.length != rows)
                return res.status(400).send({message: "Error creating classroom"});
            const classroom = new Classroom({
                name,
                rows,
                cols,
                computers
            });

            try{
            const savedClassroom = await classroom.save();
            res.status(200).json(savedClassroom);
            }
            catch(err){
                console.log(err);
            }
        } catch (err: any) {
            res.status(400).json({ message: `Error adding classroom: ${err.message}` });
        }
    }
});

classroomRouter.patch("/updateComputer/:id", authorizeToken, async (req:any, res)=> {
    if (!verifyToken(req.token))
        return res.status(403).send({ message: "Invalid token" });
    else {
        try {
            const classroomId = req.params.id;
            
            const classroom = await Classroom.findById(classroomId);

            if (!classroom) {
                return res.status(404).send({ message: "Classroom not found" });
            }

            const updatedComputerData = req.body;

            const [className, row, col] = updatedComputerData.name.split('_');

            const rowIndex = parseInt(row);
            const colIndex = parseInt(col);

            if (isNaN(rowIndex) || isNaN(colIndex)) {
                return res.status(400).send({ message: "Invalid row or column index" });
            }

            classroom.computers[rowIndex][colIndex] = updatedComputerData;

            const updatedClassroom = await classroom.save();

            res.status(200).send(updatedClassroom);
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Internal server error" });
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
    console.log("doslo je do servera");
    if (!verifyToken(req.token)) {
        return res.status(403).send({ message: "Invalid token" });
    }
    else {
        console.log("dobar je token");
        try {
            const classrooms = await Classroom.find({}).populate({
                path: 'computers',
                populate: {
                    path: 'student'
                }
            });
            console.log("potrazio je classroom-e");
    
            if (classrooms.length > 0) {
                res.status(200).json(classrooms);
            } else {
                console.log("nije naso classroom");
                res.status(400).json({ message: "Could not find classrooms" });
                console.log("ovo ne vidis");
            }
        } catch (err: any) {
            res.status(500).json({ message: `Error retrieving classrooms: ${err.message}` });
        }
    }   
});

classroomRouter.post("/filteredFind", authorizeToken, async (req: any, res) => {
    if (!verifyToken(req.token))
        return res.status(403).send({ message: "Invalid token" });
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
        return res.status(403).send({ message: "Invalid token" });
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