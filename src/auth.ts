import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


interface TokenPayload {
  userId: string;
}

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Token error' });
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: 'Token malformatted' });
  }

  jwt.verify(token, 'your-secret-key-here', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token ' + err + ' ' + decoded });
    }

    const { userId } = decoded as TokenPayload;
    console.log(userId);
    // req.userId = userId;

    return next();
  });
}
