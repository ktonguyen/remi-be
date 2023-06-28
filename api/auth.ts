import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { secretKey } from '../config/keys';
import { User } from '../model/user';
const router = Router();


router.post('/signin', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = new User("", email, "");
    let result: any = await user.findByEmail();
    if(!result) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    if (result?.error) {
      return res.status(400).json({ error: result.error });
    }
    if (bcrypt.compareSync(password, result.password || "")) {
      const token = jwt.sign({ email, id: result.id, name:  result.name }, secretKey, { expiresIn: '4h' });
      res.json({ token, user: { email, id: result.id, name: result.name, accessToken: token } });
    } else {
      res.status(400).json({ error: 'Invalid email or password' });
    }
  } catch(err: any) {
    console.log("ress", err)
    res.status(400).json({ error: err.message });
  } 
  
});

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User(name, email, hashedPassword);
    if(!user.isValid()) {
      return res.status(400).json({ error: "Invalid data" });
    }

    let userExist: any = await user.findByEmail();
    if (userExist?.error) {
      return res.status(400).json({ error: userExist.error });
    }
    if(userExist) {
      return res.status(400).json({ error: "User already exist" });
    }
    let result = await user.insert();
    res.status(200).json({ result });
  } catch(err: any) {
    res.status(400).json({ error: err.message });
  }
  
});

export default router;
