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
import RegistrationRequest from "../models/registrationRequest";

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
            return res.status(400).send({message: "Ovaj domen nije validan"});

        if(foundStudent && privileges !== "student")
            return res.status(400).send({message: "Ovaj domen mogu imati samo studentske email adrese"});
        
        if(foundProfessor && privileges === "student")
            return res.status(400).send({message: "Ovaj domen mogu imati samo profesorske email adrese"});

        let userExists = await User.findOne({ email });
        if (userExists) 
            return res.status(400).json({ message: 'Korisnik sa ovom email adresom već postoji' });
        
        userExists = await User.findOne({ index: parseInt(index) });
        if(userExists)
            return res.status(400).send({message: "Korisnik sa ovim brojem indeksa već postoji"});

        if(!strongPassword.test(password))
            return res.status(400).send({message: `Slaba šifra. Šifra mora imati: - Makar 8 karaktera - Makar jedan specijalni karakter - Makar jedan broj - Makar jedno veliko slovo`});
        
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
            from: `ZakažiLab <${emailParams.email}`,
            to: email,
            subject: "Pošaljite registraciju",
            text: `http://localhost:3000/register/${token}`,
            html: `<p>Ovaj link je validan <b>15 minuta</b></p>
                   <a href="http://localhost:3000/register/${token}" target="_blank"><p>Pošaljite registraciju!</p></a>`
        };

        transporer.sendMail(mailOptions, (err, info) => {
            err ?
            console.log(err) :
            console.log(`Email sent to ${email}`);
        });

        res.status(200).json({message: `Email poslat na adresu ${email}. Klikom na link koji Vam je stigao, šaljete unete podatke administratoru na uvid. Administrator će vam odobriti ili odbijti zahtev u narednom periodu`});
    } 
    catch (error:any) {
        res.status(500).json({ message: 'Error registering user', error:`${error.message}}`});
    }
    
    
});

userRouter.post("/register/contactAdmin", authorizeToken, async (req: any, res) => {
    let data: any;
    if(!(data = verifyToken(req.token)))
        return res.status(400).send({message: "Invalid token"});

    

    data =  Object.keys(data)
                  .filter(objectKey => objectKey !== "iat" && objectKey !== "exp")
                  .reduce((newObject: any, key) => {
                            newObject[key] = data[key];
                            return newObject;
                          }, {});

    const newToken = signToken({data}, "", true);
              
    const regRequest = new RegistrationRequest({token: newToken});

    try{
        const savedReq = await regRequest.save();
        res.status(200).json({message: "Uspešno poslat zahtev administratorima"});
    }
    catch(err){
        res.status(500).send({message: "Error sending request", err});
    }
});

userRouter.post("/register/confirm", authorizeToken, async (req:any, res) => {
   
    let data: any = verifyToken(req.token);
    if(!data)
        return res.status(400).send({message: "Expired token"});

    if(!("status" in req.body))
        return res.status(400).send({message: "Invalid body, status needed"});
    console.log(data);

    const request = await RegistrationRequest.findOne({token: req.body.requestToken});
        
    if (request === null)
        return res.status(400).send({message: "Request not found"}); 

    let requestToken = verifyToken(request.token);

    if(!requestToken)
        return res.status(400).send({message: "Invalid token"});

    requestToken = requestToken["data"];

    if(req.body.status === false){
        const mailOptions = {
            from: `ZakažiLab <${emailParams.email}`,
            to: requestToken.email,
            subject: "Zahtev za registraciju ODBIJEN",
            text: `Administrator je odbio Vaš zahtev za registraciju, pokušajte ponovo. Obratite pažnju na ispravnost unetih podataka`,
            html: `<p>Administrator je <b>odbio</b> Vaš zahtev za registraciju, pokušajte ponovo. Obratite pažnju na ispravnost unetih podataka<br/></p>
                   <p>Razlog: ${req.body.message}</p>`
       };
       transporer.sendMail(mailOptions, (err, info) => {
            err ?
            console.log(err) :
            console.log(`Email sent to ${requestToken.email}`);
        });

        try{
            await RegistrationRequest.findOneAndDelete({token: req.body.requestToken});
            return res.status(200).send({message: "Administrator je odbio zahtev"});
        }
        catch(err){
            return res.status(400).send({message: "Error deleting request"});
        }
    }
    else{

        
        let dbUser;
        const type = requestToken.privileges;
        switch(type){
            case "student": 
                dbUser = new Student(requestToken);
                break;
            case "assistant": 
                dbUser = new Assistant(requestToken);
                break;
            case "admin": 
                dbUser = new Admin(requestToken);
                break;
            case "professor": 
                dbUser = new Professor(requestToken);
                break;
            default: 
                return res.status(400).json({ message: "Invalid privileges" });

            console.log(dbUser);
        }
        try{
            await dbUser.save();
            await RegistrationRequest.findOneAndDelete({token: req.body.requestToken});
            const mailOptions = {
                from: `ZakažiLab <${emailParams.email}`,
                to: requestToken.email,
                subject: "Zahtev za registraciju ODOBREN",
                text: `Administrator je odobrio Vaš zahtev za registraciju. Od sada se možete ulogovati sa email adresom i šifrom koju ste naveli prilikom registracije`,
                html: `<p>Administrator je <b>odobrio</b> Vaš zahtev za registraciju. Od sada se možete ulogovati sa email adresom i šifrom koju ste naveli prilikom registracije</p>`
           };
           transporer.sendMail(mailOptions, (err, info) => {
                err ?
                console.log(err) :
                console.log(`Email sent to ${requestToken.email}`);
            });
            res.status(200).send({message: "Uspešna registracija"});
        }
        catch(err){
            res.status(400).send({message: "Error saving user to database"});
        }
    }
    
});


userRouter.post("/login", async (req, res) => {
    
    const { email, password } = req.body;
    if (!email || !password) 
      return res.status(400).json({ message: 'Email i šifra su obavezna polja' });
    
    try {
        const user = await User.findOne({ email });
    
        if (!user)
            return res.status(400).json({ message: 'Pogrešan email ili šifra' });
    
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch) 
            return res.status(400).json({ message: 'Pogrešan email ili šifra' });
        
        let userType = 'User';
    
        if (user instanceof Assistant) 
            userType = 'Assistant';
        else if (user instanceof Professor)
            userType = "Professor"
        else if (user instanceof Admin) 
            userType = 'Admin';
        else if (user instanceof Student) 
            userType = 'Student';
      
        const token = signToken({id: user._id, email: user.email, privileges: user.privileges});
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
            const token = signToken({id: verified._id, email: verified.email, privileges: verified.privileges});
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

userRouter.post("/resetPasswordEmail", async (req, res) => {
    if(!req.body.email)
        return res.status(400).send({message: "Email je obavezno polje"});
    const email = req.body.email;
    let existingUser;
    try{
        existingUser = await User.findOne({email});
        if(existingUser === null)
            return res.status(400).send({message:"Korisnik sa ovom email adresom ne postoji" });
    }
    catch(err){
        console.log(err);
        return res.status(500).send({message: `Error finding student: ${err}`});
    }
    
    const token = signToken({id: existingUser._id}, "15m");

    const mailOptions = {
        from: `ZakažiLab <${emailParams.email}>`,
        to: email,
        subject: "Resetovanje šifre",
        text: `http://localhost:3000/resetPassword/${token}`,
        html: `<p>Ovaj link je validan <b>15 minuta</b></p>
               <a href="http://localhost:3000/resetPassword/${token}" target="_blank"><p>Resetujte šifru!</p></a>`
    };

    transporer.sendMail(mailOptions, (err, info) => {
        err ?
        console.log(err) :
        console.log(info);
    });

    return res.status(200).send({message: `Email poslat na adresu ${email}`});

});

userRouter.post("/resetPassword", authorizeToken, async (req: any, res) => {
    let data;
    if(!(data = verifyToken(req.token)))
        return res.status(403).send({message: "Invalid token"});

    if(!req.body.password || !req.body.confirmPassword)
        return res.status(400).send({message: "Šifra i potvrda šifre su obavezna polja"});
    
    if(req.body.password !== req.body.confirmPassword)
        return res.status(400).send({message: "Šifre se ne poklapaju"});
    
    if(!strongPassword.test(req.body.password))
        return res.status(400).send({message: "Slaba šifra"});

    const user = await User.findById({_id: data.id});

    if(user === null)
        return res.status(500).send({message: "Greška pri pronalaski korisnika u bazi"});


    const checkOld = await bcrypt.compare(user.password, req.body.password);
    if(checkOld)
        return res.status(400).send({message: "Nova šifra ne može biti ista kao trenutna"});

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    user.password = hashedPassword;
    try{
        await user.save();
        return res.status(200).send({message: "Uspešno resetovana šifra"});
    }
    catch(err){
        console.log(err);
        return res.status(500).send({message: "Error updating password"});
    }

});

export default userRouter;