import { Router } from "express";
import User from "../models/user";
import { authorizeToken, signToken, verifyToken, signRefresh, verifyRefresh} from "../config/tokenFuncs";
import bcrypt from "bcryptjs"
import Assistant from "../models/assistant";
import Admin from "../models/admin";
import Student from "../models/student";
import Professor from "../models/professor";
import nm from "nodemailer";
import { emailParams, transporer, strongPassword, VALID_DOMAINS } from "../config/config";
import subjectRouter from "./subjectRouter";

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
            res.status(400).json( {message: "Error adding user", error} );
        }
    }
});

userRouter.patch("/update/:id", authorizeToken, async (req: any, res) => {
    if (!verifyToken(req.token)) {
        return res.status(403).send({ message: "Invalid token" });
    }

    const userId = req.params.id;
    const { name, lastName, email, privileges } = req.body;

    if (!userId) {
        return res.status(400).send({ message: "User Id needed for update" });
    }

    try {
        const updateFields: any = {};
        if (name !== undefined) updateFields.name = name;
        if (lastName !== undefined) updateFields.lastName = lastName;
        if (email !== undefined) updateFields.email = email;
        if (privileges !== undefined) updateFields.privileges = privileges;

        const result = await User.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!result) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).json(result);
    } catch (error:any) {
        res.status(400).json({ message: `Error updating user: ${error.message}` });
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
        res.status(500).json({ message: "Error finding one of the users", error});
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
                    return res.status(404).json({ error: "User not found" });

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
                res.status(403).send({message: ""});
            else{
                const userId = req.params.id;

                const user = await User.findByIdAndDelete(userId);

                if (!user) {
                    return res.status(404).json({ error: "User not found" });
                }
                
                res.json({ message: "User successfully deleted" });
            }
        } catch (error) {
            console.error('Error deleting user: ', error);
            res.status(500).json({ error: 'Internal server error' });
        }
});

userRouter.post("/register", async (req:any, res) => {
    

    const { 
            name, lastName, email,
            password, privileges, module,
            gradDate, gradFaculty, birthDate, index,
            phdGradDate, phdGradFaculty
        } = req.body;
    
    if (!name || !lastName || !email || !password || !privileges) 
        return res.status(400).json({ message: 'All of the fields are necessary' });
    
    try {

        const foundStudent = VALID_DOMAINS[0].some(domain => {
            if(email.includes(domain))
                return true;
            return false;
        });

        const foundProfessor = VALID_DOMAINS[1].some(domain => {
            if(email.includes(domain))
                return true;
            return false;
        })

        if(!foundStudent && !foundProfessor)
            return res.status(400).send({message: "This domain isn't accepted"});

        if(foundStudent && privileges !== "student")
            return res.status(400).send({message: "This domain can only be for students"});
        
        if(foundProfessor && privileges === "student")
            return res.status(400).send({message: "This domain cannot be for students"});

        let userExists = await User.findOne({ email });
        if (userExists) 
            return res.status(400).json({ message: 'Email already registered' });
        
        userExists = await User.findOne({ index: parseInt(index) });
        if(userExists)
            return res.status(400).send({message: "Index already registered"});

        if(!strongPassword.test(password))
            return res.status(400).send({message: "Weak password"});
        
        const hashedPassword = await bcrypt.hash(password, 10);
        let newUser;
    
        switch (privileges) {
        case 'assistant':
            newUser = { name, lastName, email, password: hashedPassword, privileges, module, gradDate, gradFaculty };
            break;
        case 'admin':
            newUser = { name, lastName, email, password: hashedPassword, privileges, FoG: true };
            break;
        case 'student':
            newUser =  {name, lastName, email, password: hashedPassword, privileges, birthDate, index, module };
            break;
        case 'professor':
            newUser = {name, lastName, email, password: hashedPassword, privileges, module, gradDate, gradFaculty, phdGradDate, phdGradFaculty }
            break;
        default:
            return res.status(400).json({ message: 'Invalid privileges' });
        }
        
        const token = signToken(JSON.parse(JSON.stringify(newUser)), "15m");

        const mailOptions = {
            from: emailParams.email,
            to: email,
            subject: "Završite registraciju",
            text: `http://localhost:3000/register/${token}`,
            html: `<p>Ovaj link je validan 15 minuta</p>
                   <a href="http://localhost:3000/register/${token}" target="_blank"><p>Potvridte registraciju!</p></a>`
        };

        transporer.sendMail(mailOptions, (err, info) => {
            err ?
            console.log(err) :
            console.log(`Email sent to ${email}`);
        });

        res.status(200).json({message: `Email successfully sent to ${email}`});
    } 
    catch (error:any) {
        res.status(500).json({ message: 'Error registering user', error:`${error.message}}`});
    }
    
    
});

userRouter.post("/register/confirm", async (req, res) => {
    if(!req.body.token)
        res.status(422).send({message: "Unprocessable request"});
    else{
        let data = verifyToken(req.body.token);
        if(!data)
            res.status(400).send({message: "Expired token"});
        else{

            const invalidateTokens = await User.findOne({email: data.email});
            
            if(invalidateTokens != null)
                return res.status(400).send({message: `Korisnik sa email adresom ${data.email} je već registrovan`});

            data =  Object.keys(data)
                          .filter(objectKey => objectKey !== "iat" && objectKey !== "exp")
                          .reduce((newObject: any, key) => {
                                    newObject[key] = data[key];
                                    return newObject;
                                }, {});
            let dbUser;
            const type = data.privileges;
            switch(type){
                case "student": 
                    dbUser = new Student(data);
                    break;
                case "assistant": 
                    dbUser = new Assistant(data);
                    break;
                case "admin": 
                    dbUser = new Admin(data);
                    break;
                case "professor": 
                    dbUser = new Professor(data);
                    break;
                default: 
                    return res.status(400).json({ message: "Invalid privileges" });
            }
            try{
                await dbUser.save();
                res.status(200).send({message: "Završena registracija"});
            }
            catch(err){
                res.status(400).send({message: "Error saving user to database"});
            }
        }
    }
});


userRouter.post("/login", async (req, res) => {
    
    const { email, password } = req.body;
    if (!email || !password) 
      return res.status(400).json({ message: 'Email and password are necessary' });
    
    try {
        const user = await User.findOne({ email });
    
        if (!user)
            return res.status(400).json({ message: 'Wrong email or password' });
    
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch) 
            return res.status(400).json({ message: 'Wrong email or password' });
        
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

        res.status(200).json({token, refreshToken, user, message: 'Successfull log-in'});
    } 
    catch (error) {
      res.status(500).json({ message: 'Error logging in', error });
    }
});

userRouter.post("/refresh", (req, res) => {
    if (!req.body.token)
        res.status(422).send({message: "Unprocessable request"});
    else{
        if(req.body.token !== mainRefreshToken)
            return res.status(422).send({message: "Invalid token"});
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
            return res.status(422).send({message: "Refresh token necessary"});
        
        if(verifyRefresh(req.body.token) !== false){
            mainRefreshToken = "";
            res.status(200).send({message: "Successful log-out"});
        }

    }
});

export default userRouter;