// app/api/auth/me/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDb from '../../../../lib/connectDb';
import User from '../../../../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'kst_apnidukaan';

export async function GET(request) {
  console.log('--- API /api/auth/me GET request received ---');
  await connectDb();

  try {
    const authHeader = request.headers.get('Authorization');
    console.log('[API /auth/me] Authorization Header:', authHeader ? 'Present' : 'Missing');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[API /auth/me] No token provided or malformed header.');
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log('[API /auth/me] Token successfully decoded:', decoded);
    } catch (error) {
      console.error('[API /auth/me] JWT verification failed:', error.message);
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    // --- FIX 1: Change decoded.userId to decoded.id ---
    // The JWT token payload has 'id', not 'userId'
    if (!decoded.id) {
        console.error('[API /auth/me] Decoded token payload missing "id" property.');
        return NextResponse.json({ message: 'Invalid token payload' }, { status: 400});
    }
    console.log('[API /auth/me] Searching for user with ID:', decoded.id);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      console.log('[API /auth/me] User not found for ID:', decoded.id);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const userObject = user.toObject();
    console.log('[API /auth/me] User found. Returning user data.');

    // --- FIX 2: Wrap userObject in a 'user' property for consistency ---
    return NextResponse.json({ user: userObject }, { status: 200 });

  } catch (error) {
    console.error('Error in /api/auth/me (caught in try-catch):', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    console.log('--- API /api/auth/me GET request finished ---');
  }
}