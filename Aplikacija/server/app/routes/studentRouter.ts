import { Router } from "express";
import Student from "../models/student";
import { authorizeToken, verifyToken } from "../config/tokenFuncs";




const studentRouter = Router();

//dodavanje
studentRouter.post("/add", authorizeToken, async (req:any, res) => {
    let data;
    if(!(data = verifyToken(req.token))) 
        return res.status(403).send({message: "Invalid token"});
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

studentRouter.patch("/update/:id", async (req, res) => {
    const studentId = req.params.id;
    const { name, lastName, email, password, privileges, birthDate, index, module } = req.body;

    if (!studentId) {
        return res.status(400).send({ message: "Student ID is required for update" });
    }

    try {
        const updateFields: any = {};
        if (name !== undefined) updateFields.name = name;
        if (lastName !== undefined) updateFields.lastName = lastName;
        if (email !== undefined) updateFields.email = email;
        if (password !== undefined) updateFields.password = password;
        if (privileges !== undefined) updateFields.privileges = privileges;
        if (birthDate !== undefined) updateFields.birthDate = birthDate;
        if (index !== undefined) updateFields.index = index;
        if (module !== undefined) updateFields.module = module;

        const result = await Student.findByIdAndUpdate(
            studentId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!result) {
            return res.status(404).send({ message: "Student not found" });
        }

        res.status(200).json(result);
    } catch (err: any) {
        res.status(400).json({ message: `Error updating student: ${err.message}` });
    }
});

//find all
studentRouter.get('/findAll', authorizeToken, async (req: any, res) => {
    try {
        if(!verifyToken(req.token)) 
            res.status(403).send({message: "Invalid token"});
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
                res.status(403).send({message: "Invalid token"});
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
    "/delete/:id", authorizeToken,
    async (req:any, res) => {
        try {
            if(!verifyToken(req.token)) 
                res.status(403).send({message: "Invalid token"});
            else {
                const studentId = req.params.id;

                const student = await Student.findByIdAndDelete(studentId);
    
                if (!student) {
                    return res.status(404).json({ error: "Student not found" });
                }
    
                res.json({ message: "Student deleted successfully" });
            }
        } catch (error) {
            console.error('Error deleting student: ', error);
            res.status(500).json({ error: 'Internal server error' });
        }
});

export default studentRouter;