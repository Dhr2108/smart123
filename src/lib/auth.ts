import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import connectDB from './db';
import { User, type IUser } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<(IUser & { _id: string }) | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    await connectDB();
    const user = await User.findById(payload.userId).select('-password').lean();
    if (!user) return null;

    return user as unknown as IUser & { _id: string };
  } catch {
    return null;
  }
}

export function createAuthResponse(user: IUser & { _id: unknown }) {
  const payload: JWTPayload = {
    userId: String(user._id),
    email: user.email,
    role: user.role,
    name: user.name,
  };

  const token = generateToken(payload);

  return { token, user: payload };
}

/**
 * Middleware-like function to validate auth in route handlers.
 * Returns the JWT payload or null.
 */
export async function authenticateRequest(request: Request): Promise<JWTPayload | null> {
  // Check Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return verifyToken(token);
  }

  // Fallback to cookie
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  if (token) {
    return verifyToken(token);
  }

  return null;
}

/**
 * Check if the authenticated user has the required role(s).
 */
export function authorizeRole(user: JWTPayload, allowedRoles: string[]): boolean {
  return allowedRoles.includes(user.role);
}
