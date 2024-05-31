import {Router} from "express";
import professor from "../models/professor";
import Professor from "../models/professor";

const professorRouter = Router();

professorRouter.get("/findAll", async (req, res) => {
    
    const found = await professor.find({});

    found != null ? 
    res.status(200).send(found) : 
    res.status(404).send({message: "professors not found"});

}); 

professorRouter.post("/add", async (req, res) => {
    const {
            name, lastName, email,
            privileges, module, gradDate,
            gradFaculty, phdGradDate, phdGradFaculty
        } = req.body;
    const ast = new professor({
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

professorRouter.post("/filteredFind", async (req, res) => {
    const query = req.body;

    const professors = await professor.find(query);
    professors != null ?
    res.status(200).send(professors) :
    res.status(404).send({message: "professors with filter not found"});

});

professorRouter.delete("/delete/:id", async (req, res) => {
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
});

export default professorRouter;