import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/db';
import { User } from '@/models/User';
import { hashPassword, comparePasswords, createAuthResponse } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    await connectDB();

    if (action === 'register') {
      return handleRegister(body);
    } else if (action === 'login') {
      return handleLogin(body);
    } else if (action === 'logout') {
      return handleLogout();
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleRegister(body: {
  name: string;
  email: string;
  password: string;
  role?: string;
  department?: string;
}) {
  const { name, email, password, role, department } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: (role as 'Admin' | 'Doctor' | 'Nurse' | 'Receptionist' | 'Pharmacist' | 'Lab Technician' | 'Accountant' | 'Patient') || 'Receptionist',
    department: department || 'General',
  });

  const { token, user: userData } = createAuthResponse(user);

  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  return NextResponse.json({ user: userData, token }, { status: 201 });
}

async function handleLogin(body: { email: string; password: string }) {
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  if (!user.isActive) {
    return NextResponse.json({ error: 'Account is deactivated' }, { status: 403 });
  }

  const isValidPassword = await comparePasswords(password, user.password);
  if (!isValidPassword) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  const { token, user: userData } = createAuthResponse(user);

  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });

  return NextResponse.json({ user: userData, token });
}

async function handleLogout() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
  return NextResponse.json({ message: 'Logged out successfully' });
}
