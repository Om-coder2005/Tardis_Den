import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { AuthService } from '../services/auth.service';

const COOKIE_NAME = 'tardis_session';
const jwtSecret = process.env.JWT_SECRET || 'tardis-den-default-jwt-secret-key';
const isProd = process.env.NODE_ENV === 'production';

const cookieOptions = {
  httpOnly: true,
  sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
  secure: isProd,
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

export const AuthController = {
  async login(req: Request, res: Response) {
    const { passcode } = req.body;

    if (!passcode || typeof passcode !== 'string' || passcode.trim().length === 0) {
      return res.status(400).json({ error: 'Invalid passcode format' });
    }

    const token = await AuthService.login(passcode);
    if (!token) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.cookie(COOKIE_NAME, token, cookieOptions);

    res.json({ success: true });
  },

  async session(req: Request, res: Response) {
    const token = req.cookies[COOKIE_NAME];
    if (!token) {
      return res.json({ authenticated: false });
    }
    try {
       const decoded = jwt.verify(token, jwtSecret) as { sessionId: string };
       const session = await prisma.session.findUnique({ where: { id: decoded.sessionId } });

       if (!session || session.expiresAt < new Date()) {
         return res.json({ authenticated: false });
       }

       return res.json({ authenticated: true });
    } catch {
       return res.json({ authenticated: false });
    }
  },

  async logout(req: Request, res: Response) {
    const token = req.cookies[COOKIE_NAME];
    if (token) {
      await AuthService.logout(token);
      res.clearCookie(COOKIE_NAME, {
        path: '/',
        sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
        secure: isProd
      });
    }
    res.json({ success: true });
  }
};
