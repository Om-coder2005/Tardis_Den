import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';

export const AuthService = {
  async login(passcode: string): Promise<string | null> {
    const expectedPasscode = process.env.ADMIN_PASSKEY || '123456';

    // Convert strings to Buffer for constant-time comparison
    const a = Buffer.from(passcode);
    const b = Buffer.from(expectedPasscode);

    let match = false;
    if (a.length === b.length) {
      match = crypto.timingSafeEqual(a, b);
    } else {
      // Dummy operation to prevent length timing side channels
      crypto.timingSafeEqual(b, b);
    }

    if (!match) {
      // Add deliberate artificial delay on failure to thwart automated brute-force attempts
      await new Promise((resolve) => setTimeout(resolve, 800));
      return null;
    }

    // Enforce single-user session security: clear all previous active sessions
    await prisma.session.deleteMany({});

    // Create new session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const session = await prisma.session.create({
      data: {
        token: 'placeholder_for_jwt_to_be_generated',
        expiresAt,
      }
    });

    const jwtSecret = process.env.JWT_SECRET || 'tardis-den-default-jwt-secret-key';
    const token = jwt.sign({ sessionId: session.id }, jwtSecret, { expiresIn: '7d' });
    await prisma.session.update({
      where: { id: session.id },
      data: { token }
    });

    return token;
  },

  async logout(token: string): Promise<void> {
    try {
      const jwtSecret = process.env.JWT_SECRET || 'tardis-den-default-jwt-secret-key';
      const decoded = jwt.verify(token, jwtSecret) as { sessionId: string };
      await prisma.session.delete({ where: { id: decoded.sessionId } });
    } catch (e) {
      // Ignore invalid tokens during logout
    }
  }
};

