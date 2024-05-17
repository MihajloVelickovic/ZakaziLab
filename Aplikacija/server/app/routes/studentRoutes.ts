import { Router } from 'express';
import Student from '../models/student';
import { Request, Response } from 'express';

const router = Router();

//dodavanje
router.post('students/studnetAdd', async (req, res) => {
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
router.get('students/studentFindAll', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch(error) {
        res.status(500).json({ message: "greska"});
    }
});

//find one
router.get(
    '/students/filteredFind/:...parameters',
    async ( req: Request, res: Response) => {
    
        try {
            const parameters = req.params.parameters.split('/');

            const query:any = {};
            
            for (let i = 0; i < parameters.length; i += 2) {
                const param = parameters[i];
                const value = parameters[i + 1];
                query[param] = value;
            }

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

export default router;