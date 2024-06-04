import { Router } from "express";
import User from "../models/user";
import { authorizeToken, verifyToken } from "../config/tokenFuncs";

const userRouter = Router();

//dodavanje
userRouter.post("/add", async (req, res) => {
    const { name, lastName, email,
         privileges} = req.body;
    
    const user = new User({ name, lastName, email,
        privileges});
        
    try {
        const saveduser = await user.save();
        res.status(201).json(saveduser);
    } catch(error) {
        res.status(400).json( {message: "greska"} );
    }
});

//find all
userRouter.get('/findAll', authorizeToken, async (req: any, res) => {
    try {
        if(!verifyToken(req.token)) 
            res.status(403).send({message: "Invalid authentication"});

        const users = await User.find({});
        res.json(users);
    } catch(error) {
        res.status(500).json({ message: "Could not find users"});
    }
});

//find one
userRouter.post(
    "/filteredFind",
    authorizeToken,
    async (req:any, res) => {
    
        if(!verifyToken(req.token)) 
            res.status(403).send({message: "Invalid authentication"});
        else{
            try {
                const query = req.body;

                const user = await User.findOne(query);
                
                if(!user) 
                    return res.status(404).json({ error: "user not found" });

                res.status(200).json(user);
            }
            catch(error) {
                console.error('Error finding user: ', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
});

//delete one
userRouter.delete(
    "/delete/:id",
    async (req, res) => {
        try {
            const userId = req.params.id;

            const user = await User.findByIdAndDelete(userId);

            if (!user) {
                return res.status(404).json({ error: "user not found" });
            }

            res.json({ message: "user deleted successfully" });
        } catch (error) {
            console.error('Error deleting user: ', error);
            res.status(500).json({ error: 'Internal server error' });
        }
});

export default userRouter;