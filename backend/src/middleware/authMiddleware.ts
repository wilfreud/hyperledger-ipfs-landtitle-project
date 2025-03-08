import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).send('Authentication required');

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // @ts-ignore
    req['user'] = {
      // @ts-ignore
      mspId: decoded.org, // MSP ID from token
      userId: decoded.sub
    };
    next();
  } catch (err) {
    res.status(403).send('Invalid token');
  }
};