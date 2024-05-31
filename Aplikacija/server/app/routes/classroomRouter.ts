import { Router } from "express";
import Classroom from "../models/classroom";

const classroomRouter = Router();

classroomRouter.post("/add", async (req, res) => {
    const { name, computerNum, rows, cols, computers } = req.body;

    const classroom = new Classroom({name, computerNum, rows, cols, computers});

    try{
        const savedClassroom = await classroom.save();
        res.status(200).json(savedClassroom);
    } catch(err : any) {
        res.status(400).json( {message: 'err.message'});
    }
});

classroomRouter.get("/findAll", async (req, res) => {
    const classrooms = await Classroom.find({});

    classrooms != null ?
    res.status(200).json(classrooms):
    res.status(400).json({message:"Could not find classrooms"});
});

classroomRouter.post("/filteredFind", async (req,res) => {
    const query = req.body;

    const classrooms = await Classroom.find(query);
    
    classrooms != null ?
    res.status(200).json(classrooms):
    res.status(400).json({message: "Could not find matching classrooms"});

});

classroomRouter.delete("/delete/:id", async (req,res) => {
    try{
        const {id} = req.params;
        const entry = await Classroom.findByIdAndDelete(id);
        entry != null ?
        res.status(200).send({message: `Deleted Classroom with id: ${id}`}) :
        res.status(404).send({message: `No Classroom with id: ${id} found`});
        
    }
    catch(err: any){
        console.log(err.message);
        return res.status(500).send({message: "Internal Server Error"});
    }
});

export default classroomRouter;