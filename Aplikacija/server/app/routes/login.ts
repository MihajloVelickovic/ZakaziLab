import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { signToken, verifyToken } from '../config/tokenFuncs';
import Assistant from '../models/assistant';
import Admin from '../models/admin';
import Student from '../models/student';
import User from '../models/user';
import Professor from '../models/professor';

const loginRouter = Router();


loginRouter.post('/', async (req: Request, res: Response) => {
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

    res.status(200).json({token, user, message: 'Login successful'});
  } 
  catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

export default loginRouter;
