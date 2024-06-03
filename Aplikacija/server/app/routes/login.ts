import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import Assistant from '../models/assistant';
import Admin from '../models/admin';
import Student from '../models/student';
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

    const newpass = await bcrypt.hash(password, 10);

    const isMatch = await bcrypt.compare(newpass, user.password);

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
