import { Router } from 'express';
import Student from '../models/student';
import { Request, Response } from 'express';

const router = Router();

//dodavanje
router.post('/students/studentAdd', async (req, res) => {
    const { name, lastName, email,
         privileges, birthDate, index, module} = req.body;
    
    const student = new Student({ name, lastName, email,
        privileges, birthDate, index, module});
        
    try {
        const savedStudent = await student.save();
        res.status(201).json(savedStudent);
    } catch(error) {
        res.status(400).json( {message: "greska"});
    }
});

//find all
router.get('/students/studentFindAll', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch(error) {
        res.status(500).json({ message: "greska"});
    }
});

//find one
router.get(
    '/students/filteredFind',
    async ( req: Request, res: Response) => {
    
        try {
            const query = req.body;

            const student = await Student.findOne(query);

            if(!student) {
                return res.status(404).json({ error: "Student not found" });
            }

            res.json(student);
        } catch(error) {
            console.error('Error finding student: ', error);
            res.status(500).json({ error: 'Internal server error' });
        }
});

//delete one
router.delete(
    '/students/deleteStudent/:id',
    async (req: Request, res: Response) => {
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

export default router;