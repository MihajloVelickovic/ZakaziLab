import { Router } from "express";
import User from "../models/user";
import { authorizeToken, signToken, verifyToken, signRefresh, verifyRefresh} from "../config/tokenFuncs";
import bcrypt from "bcryptjs"
import Assistant from "../models/assistant";
import Admin from "../models/admin";
import Student from "../models/student";
import Professor from "../models/professor";


const userRouter = Router();

let mainRefreshToken: string = "";

//dodavanje
userRouter.post("/add", authorizeToken, async (req: any, res) => {
    
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid token"});
    else{
        const { name, lastName, email,
                privileges} = req.body;
    
        const user = new User({ name, lastName, email,
                                privileges});
        
        try {
            const saveduser = await user.save();
            res.status(201).json(saveduser);
        } 
        catch(error) {
            res.status(400).json( {message: "greska"} );
        }
    }
});

//find all
userRouter.get('/findAll', authorizeToken, async (req: any, res) => {
    try {
        if(!verifyToken(req.token)) 
            res.status(403).send({message: "Invalid token"});
        else{
            const users = await User.find({});
            res.json(users);
        }
    } catch(error) {
        res.status(500).json({ message: "Could not find users"});
    }
});

//find one
userRouter.get(
    "/filteredFind",
    authorizeToken,
    async (req:any, res) => {
    
        if(!verifyToken(req.token)) 
            res.status(403).send({message: "Invalid token"});
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
    authorizeToken, 
    async (req: any, res) => {
        try {
            if(!verifyToken(req.token)) 
                res.status(403).send({message: "Invalid token"});
            else{
                const userId = req.params.id;

                const user = await User.findByIdAndDelete(userId);

                if (!user) {
                    return res.status(404).json({ error: "user not found" });
                }

                res.json({ message: "user deleted successfully" });
            }
        } catch (error) {
            console.error('Error deleting user: ', error);
            res.status(500).json({ error: 'Internal server error' });
        }
});

userRouter.post("/register", async (req, res) => {
    const { 
            name, lastName, email,
            password, privileges, module,
            gradDate, gradFaculty, birthDate, index 
          } = req.body;
    
      if (!name || !lastName || !email || !password || !privileges) 
        return res.status(400).json({ message: 'All fields are required' });
      
      try {
        const userExists = await User.findOne({ email });
        if (userExists) 
          return res.status(400).json({ message: 'Email already exists' });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        let newUser;
    
        switch (privileges) {
          case 'assistant':
            newUser = new Assistant({ name, lastName, email, password: hashedPassword, privileges, module, gradDate, gradFaculty });
            break;
          case 'admin':
            newUser = new Admin({ name, lastName, email, password: hashedPassword, privileges, FoG: true });
            break;
          case 'student':
            newUser = new Student({ name, lastName, email, password: hashedPassword, privileges, birthDate, index, module });
            break;
          default:
            return res.status(400).json({ message: 'Invalid privileges' });
        }
    
        const addedUser = await newUser.save();
    
        const tokenObject = {id: addedUser._id, email: addedUser.email};
    
        const token = signToken(tokenObject);
    
        addedUser.password = "";
    
        res.status(201).json({ token: token, message: 'User registered successfully', addedUser});
      } 
      catch (error:any) {
        res.status(500).json({ message: 'Error registering user', error:`${error.message}}`});
      }
});

userRouter.post("/login", async (req, res) => {
    
    const { email, password } = req.body;
    if (!email || !password) 
      return res.status(400).json({ message: 'Email and password are required' });
    
    try {
        const user = await User.findOne({ email });
    
        if (!user)
            return res.status(400).json({ message: 'Invalid email or password' });
    
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch) 
            return res.status(400).json({ message: 'Invalid password or password' });
        
        let userType = 'User';
    
        if (user instanceof Assistant) 
            userType = 'Assistant';
        else if (user instanceof Professor)
            userType = "Professor"
        else if (user instanceof Admin) 
            userType = 'Admin';
        else if (user instanceof Student) 
            userType = 'Student';
      
        const token = signToken({id: user._id, email: user.email});
        const refreshToken = signRefresh({id: user._id, email: user.email});
  
        mainRefreshToken = refreshToken;

        res.status(200).json({token, refreshToken, user, message: 'Login successful'});
    } 
    catch (error) {
      res.status(500).json({ message: 'Error logging in', error });
    }
});

userRouter.get("/refresh", (req, res) => {
    if (!req.body.token)
        res.status(422).send({message: "Unprocessable request"});
    else{
        if(req.body.token !== mainRefreshToken)
            return res.status(422).send({message: "Invalid refresh token"});
        const verified: any = verifyRefresh(req.body.token);
        if(!verified)
            res.status(400).send({message: "Invalid refresh token"}); //AKO SE OVO DESI TREBA DA SE IZLOGUJE KORISNIK
        else{
            const token = signToken({id: verified._id, email: verified.email});
            const refreshToken = signRefresh({id: verified._id, email: verified.email});
            mainRefreshToken = refreshToken;
            res.status(200).send({token, refreshToken});
        }
    }
})

userRouter.post("/logout", authorizeToken, (req: any, res) => {
    if(!verifyToken(req.token))
        res.status(403).send({message: "Invalid token"});
    else{
        if(!req.body.token)
            return res.status(422).send({message: "Need refresh token"});
        
        if(verifyRefresh(req.body.token) !== false){
            mainRefreshToken = "";
            res.status(200).send({message: "Logged out successfully"});
        }

    }
});

export default userRouter;