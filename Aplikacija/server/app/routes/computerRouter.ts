import express from 'express';
import Computer,{ IComputer } from '../models/computer';
import { authorizeToken, verifyToken } from '../config/tokenFuncs';

const computerRouter = express.Router();

// POST route to add a new computer
computerRouter.post('/add', async (req:any, res) => {
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid authentication"});
    else {
        try {
            // Extract computer data from request body
            const { name, malfunctioned, malfunctionDesc, free, student } = req.body;
    
            // Create a new computer instance
            const newComputer: IComputer = new Computer({
                name,
                malfunctioned: malfunctioned || false,
                malfunctionDesc: malfunctioned ? malfunctionDesc || '' : '',
                free: free || true,
                student
            });
    
            // Save the new computer
            const savedComputer: IComputer = await newComputer.save();
    
            res.status(201).json(savedComputer);
        } catch (error:any) {
            res.status(400).json({ message: `Error adding computer: ${error.message}` });
        }
    }
});

computerRouter.post('/findAll', authorizeToken,async (req:any, res) => {
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid authentication"});
    else {
        try {
            const computers = await Computer.find().populate('student');
            
            res.status(200).json(computers);
        } 
        catch (error:any) {
            res.status(500).json(
                { message: `Error retrieving computers: ${error.message}` }
            );
        }
    }    
});

computerRouter.patch('/update/:id', authorizeToken, async (req:any, res) => {
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid authentication"});

    else {
        try {
            const computerId = req.params.id;
            const { name, malfunctioned, malfunctionDesc, free, student } = req.body;
            const updateFields: any = {};
            if (name !== undefined) updateFields.name = name;
            if (malfunctioned !== undefined) updateFields.malfunctioned = malfunctioned;
            if (malfunctionDesc !== undefined) updateFields.malfunctionDesc = malfunctionDesc;
            if (free !== undefined) updateFields.free = free;
            if (student !== undefined) updateFields.student = student;
    
            const updatedComputer = await Computer.findByIdAndUpdate(
                computerId,
                { $set: updateFields },
                { new: true, runValidators: true }
            ).populate('student');
    
            if (!updatedComputer) {
                return res.status(404).json({ message: 'Computer not found' });
            }
    
            res.status(200).json(updatedComputer);
        } 
        catch (error:any) {
            res.status(400).json({ message: `Error updating computer: ${error.message}` });
        }
    }

  
});

computerRouter.get('/filteredFind', authorizeToken,async (req:any, res) => {
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid authentication"});
    else {

        try {
            const filterCriteria = req.body;

        const computers = await Computer.find(filterCriteria)
        .populate('student');
        
        res.status(200).json(computers);
        } catch (error:any) {
            res.status(500).json(
                { message: `Error retrieving computers: ${error.message}` }
            );
        }
    }    
});

computerRouter.delete('/delete/:id', authorizeToken, async (req:any, res) => {
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid authentication"});
    else {
        const computerId = req.params.id;

        try {
            const deletedComputer = await Computer.findByIdAndDelete(computerId);
    
            if (!deletedComputer) {
                return res.status(404).json({ message: 'Computer not found' });
            }
    
            res.status(200).json({ message: 'Computer deleted successfully' });
        } 
        catch (error:any) {
            res.status(500).json({ message: `Error deleting computer: ${error.message}` });
        }
    }
});

export default computerRouter;