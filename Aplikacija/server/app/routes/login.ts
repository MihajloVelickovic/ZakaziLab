import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import Assistant from '../models/Assistant';
import Admin from '../models/Admin';
import Student from '../models/Student';
import User from '../models/user';

const loginRouter = Router();

loginRouter.post('/', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    let userType = 'User';

    if (user instanceof Assistant) {
      userType = 'Assistant';
    } else if (user instanceof Admin) {
      userType = 'Admin';
    } else if (user instanceof Student) {
      userType = 'Student';
    }

    res.status(200).json({ message: 'Login successful', userType, user });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

export default loginRouter;
