import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.cookies?.tardis_session;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'tardis-den-default-jwt-secret-key';
    const decoded = jwt.verify(token, jwtSecret) as { sessionId: string };
    const session = await prisma.session.findUnique({ where: { id: decoded.sessionId } });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Session expired' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
