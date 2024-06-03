import {Router} from "express";
import Admin from "../models/admin";

const AdminRouter = Router();

AdminRouter.get("/findAll", async (req, res) => {
    
    const found = await Admin.find({});

    found != null ? 
    res.status(200).send(found) : 
    res.status(404).send({message: "Admins not found"});

}); 

AdminRouter.post("/add", async (req, res) => {
    const {
            name, lastName, email, password,
            privileges, FoG
        } = req.body;
    const ast = new Admin({
                                name, lastName, email, password,
                                privileges, FoG
                            });
    
    try{
        const result = await ast.save();
        res.status(200).send(result);
    }
    catch(err: any){
        res.status(400).send({message: `Error adding Admin:
         ${err.message}`});
    }

});

AdminRouter.post("/filteredFind", async (req, res) => {
    const query = req.body;

    const Admins = await Admin.find(query);
    Admins != null ?
    res.status(200).send(Admins) :
    res.status(404).send({message: "Admins with filter not found"});

});

AdminRouter.delete("/delete/:id", async (req, res) => {
    try{
        const {id} = req.params;
        const entry = await Admin.findByIdAndDelete(id);
        entry != null ?
        res.status(200).send({message: `Deleted Admin with id: ${id}`}) :
        res.status(404).send({message: `No Admin with id: ${id} found`});
        
    }
    catch(err: any){
        console.log(err.message);
        return res.status(500).send({message: "Internal Server Error"});
    }
});

export default AdminRouter;