import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';

export const AuthService = {
  async login(passcode: string): Promise<string | null> {
    const expectedPasscode = process.env.ADMIN_PASSKEY;
    
    if (!expectedPasscode) {
      console.error('ADMIN_PASSKEY is not set in backend/.env');
      return null;
    }

    if (passcode !== expectedPasscode) {
      return null;
    }

    // Create session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const session = await prisma.session.create({
      data: {
        token: 'placeholder_for_jwt_to_be_generated', // we will update this below
        expiresAt,
      }
    });

    const token = jwt.sign({ sessionId: session.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    await prisma.session.update({
      where: { id: session.id },
      data: { token }
    });

    return token;
  },

  async logout(token: string): Promise<void> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { sessionId: string };
      await prisma.session.delete({ where: { id: decoded.sessionId } });
    } catch (e) {
      // Ignore invalid tokens during logout
    }
  }
};
