import {Router} from "express";
import admin from "../models/Admin";
import Admin from "../models/Admin";


const adminRouter = Router();

adminRouter.get("/findAll", async (req, res) => {
    
    const found = await admin.find({});

    found != null ? 
    res.status(200).send(found) : 
    res.status(404).send({message: "admins not found"});

}); 

adminRouter.post("/add", async (req, res) => {
    const {
            name, lastName, email, password,
            privileges, FoG
        } = req.body;
    const ast = new admin({
                                name, lastName, email, password,
                                privileges, FoG
                            });
    
    try{
        const result = await ast.save();
        res.status(200).send(result);
    }
    catch(err: any){
        res.status(400).send({message: `Error adding admin:
         ${err.message}`});
    }

});

adminRouter.post("/filteredFind", async (req, res) => {
    const query = req.body;

    const admins = await admin.find(query);
    admins != null ?
    res.status(200).send(admins) :
    res.status(404).send({message: "admins with filter not found"});

});

adminRouter.delete("/delete/:id", async (req, res) => {
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

export default adminRouter;