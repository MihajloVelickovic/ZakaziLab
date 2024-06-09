import {Router} from "express";
import Professor from "../models/professor";
import { authorizeToken, verifyToken } from "../config/tokenFuncs";


const professorRouter = Router();

professorRouter.get("/findAll", authorizeToken, async (req: any, res) => {
    
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid token"});
    else {
        const found = await Professor.find({}).populate('assignedLabs');
        found != null ? 
        res.status(200).send(found) : 
        res.status(404).send({message: "professors not found"});
    }
}); 

professorRouter.post("/add", async (req, res) => {
    const {
            name, lastName, email,
            privileges, module, gradDate,
            gradFaculty, phdGradDate, phdGradFaculty
        } = req.body;
    const ast = new Professor({
                                name, lastName, email,
                                privileges, module, gradDate,
                                gradFaculty, phdGradDate, phdGradFaculty
                            });
    
    try{
        const result = await ast.save();
        res.status(200).send(result);
    }
    catch(err: any){
        res.status(400).send({message: `Error adding professor:
         ${err.message}`});
    }

});

professorRouter.patch("/update/:id", authorizeToken,async (req:any, res) => {
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid token"});
    else {
            const professorId = req.params.id;
        const {
            name, lastName, email,
            privileges, module, gradDate,
            gradFaculty, phdGradDate, phdGradFaculty, assignedLabs
        } = req.body;

        if (!professorId) {
            return res.status(400).send({ message: "Professor ID is required for update" });
        }

        try {
            const updateFields: any = {};
            if (name !== undefined) updateFields.name = name;
            if (lastName !== undefined) updateFields.lastName = lastName;
            if (email !== undefined) updateFields.email = email;
            if (privileges !== undefined) updateFields.privileges = privileges;
            if (module !== undefined) updateFields.module = module;
            if (gradDate !== undefined) updateFields.gradDate = gradDate;
            if (gradFaculty !== undefined) updateFields.gradFaculty = gradFaculty;
            if (phdGradDate !== undefined) updateFields.phdGradDate = phdGradDate;
            if (phdGradFaculty !== undefined) updateFields.phdGradFaculty = phdGradFaculty;
            if(assignedLabs !== undefined) updateFields.assignedLabs = assignedLabs;

            const result = await Professor.findByIdAndUpdate(
                professorId,
                { $set: updateFields },
                { new: true, runValidators: true }
            );

            if (!result) {
                return res.status(404).send({ message: "Professor not found" });
            }

            res.status(200).send(result);
        } catch (err: any) {
            res.status(400).send({ message: `Error updating professor: ${err.message}` });
        }
    }
});


professorRouter.post("/filteredFind", authorizeToken, async (req: any, res) => {
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid token"});
    
   else {
        const query = req.body;

        const professors = await Professor.find(query).populate('assignedLabs');
        professors != null ?
        res.status(200).send(professors) :
        res.status(404).send({message: "professors with filter not found"});
   }
});

professorRouter.delete("/delete/:id", authorizeToken,async (req:any, res) => {
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid token"});
    else {
        try{
            const {id} = req.params;
            const entry = await Professor.findByIdAndDelete(id);
            entry != null ?
            res.status(200).send({message: `Deleted Professor with id: ${id}`}) :
            res.status(404).send({message: `No Professor with id: ${id} found`});
            
        }
        catch(err: any){
            console.log(err.message);
            return res.status(500).send({message: "Internal Server Error"});
        }
    }
});

export default professorRouter;