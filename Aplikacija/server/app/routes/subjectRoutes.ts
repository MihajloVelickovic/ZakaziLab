import { Router } from 'express';
import Subject from '../models/subject'

const subjectRouter = Router();

subjectRouter.post('/addSubject', async (req, res) => {
    const { ordNum, desc, date, timeSlots, maxPoints } = req.body;

    const subject = new Subject({ ordNum, desc, date, timeSlots, maxPoints });

    try {
        const savedSubject = await subject.save();

        res.status(201).json(savedSubject);
    } catch (err) {
        res.status(500).json( { message: "Could not find subjects"});
    }
});

subjectRouter.get('/findAllSubjects', async (req, res) => {
    try {
        const subjects = await Subject.find();
        res.json(subjects);
    } catch (err) {
        res.status(500).json( { message: "Could not find subjects"});
    }
});

subjectRouter.get('/filteredFind', async (req, res) => {
    try {
        const query = req.body;

        const subject = await Subject.findOne(query);

        res.json(subject);
    } catch (err) {
        res.status(500).json( { message: "Could not find subjects"});
    }
});

subjectRouter.delete('/deleteSubject/:id', async (req, res) => {
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