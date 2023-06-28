import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors, JwtPayload } from 'jsonwebtoken';
import { secretKey } from '../config/keys';

// Define a custom Request type with the user property
interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    console.log("authHeader", authHeader);
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
      return res.sendStatus(401);
    }

    jwt.verify(token, secretKey, (err: any, user: any) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } catch(err: any) {
    res.status(400).json({ error: err.message });
  }
  
};
