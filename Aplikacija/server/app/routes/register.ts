import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { signToken } from '../config/tokenFuncs';
import User from "../models/user"
import Assistant from '../models/assistant';
import Admin from '../models/admin';
import Student from '../models/student';

const registerRouter = Router();


registerRouter.post('/', async (req: Request, res: Response) => {
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

export default registerRouter;
