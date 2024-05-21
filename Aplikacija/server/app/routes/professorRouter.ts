import {Router} from "express";
import professor from "../models/professor";

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

professorRouter.get("/filteredFind", async (req, res) => {
    const query = req.body;

    const professors = await professor.find(query);
    professors != null ?
    res.status(200).send(professors) :
    res.status(404).send({message: "professors with filter not found"});

});

professorRouter.delete("/delete/:id", async (req, res) => {
    //TODO
});

export default professorRouter;