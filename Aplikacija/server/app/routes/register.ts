import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from "../models/user"
import Assistant from '../models/Assistant';
import Admin from '../models/Admin';
import Student from '../models/Student';

const registerRouter = Router();

registerRouter.post('/', async (req: Request, res: Response) => {
  const { name, lastName, email, password, privileges, module, gradDate, gradFaculty, birthDate, index } = req.body;

  if (!name || !lastName || !email || !password || !privileges) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

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

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

export default registerRouter;
