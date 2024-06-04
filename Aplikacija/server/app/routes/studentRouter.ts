import { Router } from "express";
import Student from "../models/student";
import { authorizeToken, verifyToken } from "../config/tokenFuncs";




const studentRouter = Router();

//dodavanje
studentRouter.post("/add", async (req, res) => {
    const { name, lastName, email, password,
         privileges, birthDate, index, module} = req.body;
    
    const student = new Student({ name, lastName, email, password,
        privileges, birthDate, index, module});
        
    try {
        const savedStudent = await student.save();
        res.status(201).json(savedStudent);
    } catch(error) {
        res.status(400).json( {message: "greska"} );
    }
});

//find all
studentRouter.get('/findAll', authorizeToken, async (req: any, res) => {
    try {
        if(!verifyToken(req.token)) 
            res.status(403).send({message: "Invalid authentication"});
        else{
            const students = await Student.find({});
            res.json(students);
        }   
    } catch(error) {
        res.status(500).json({ message: "Could not find students"});
    }
});

//find one
studentRouter.post(
    "/filteredFind",
    authorizeToken,
    async (req: any, res) => {
    
        try {

            if(!verifyToken(req.token)) 
                res.status(403).send({message: "Invalid authentication"});
            else{
                const query = req.body;

                const student = await Student.find(query);
                student === null ? 
                res.status(404).json({ error: "Student not found" }) :
                res.status(200).json(student);

            }
        } catch(error) {
            console.error('Error finding student: ', error);
            res.status(500).json({ error: 'Internal server error' });
        }
});

//delete one
studentRouter.delete(
    "/delete/:id",
    async (req, res) => {
        try {
            const studentId = req.params.id;

            const student = await Student.findByIdAndDelete(studentId);

            if (!student) {
                return res.status(404).json({ error: "Student not found" });
            }

            res.json({ message: "Student deleted successfully" });
        } catch (error) {
            console.error('Error deleting student: ', error);
            res.status(500).json({ error: 'Internal server error' });
        }
});

export default studentRouter;