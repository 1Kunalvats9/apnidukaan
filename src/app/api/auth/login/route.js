import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDb from '../../../../lib/connectDb'; // Adjust path if necessary
import User from '../../../../models/User';     // Adjust path if necessary

export async function POST(request) {
  console.log('--- API /api/auth/login POST request received ---');
  await connectDb();

  try {
    const { email, password } = await request.json();
    console.log('Received login attempt for email:', email);
    // console.log('Received password (for debug, remove in prod):', password); // DANGER: Do not log passwords in production!

    if (!email || !password) {
      console.log('Error: Email or password missing.');
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find the user by email, explicitly selecting the password field
    const user = await User.findOne({ email }).select('+password');
    console.log('User search result:', user ? 'Found user' : 'User not found');

    if (!user) {
      console.log('Authentication failed: User not found for email:', email);
      return NextResponse.json(
        { message: 'Invalid credentials' }, // Generic message for security
        { status: 401 }
      );
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await user.comparePassword(password);
    console.log('Password comparison result (isMatch):', isMatch);

    if (!isMatch) {
      console.log('Authentication failed: Password does not match for email:', email);
      return NextResponse.json(
        { message: 'Invalid credentials' }, // Generic message for security
        { status: 401 }
      );
    }

    // If we reach here, credentials are valid
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log('JWT generated successfully for user:', user.email);

    const userResponseData = {
      _id: user._id,
      shopName: user.shopName,
      ownerName: user.ownerName,
      email: user.email,
      location: user.location,
      category: user.category,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const response = NextResponse.json(
      { message: 'Login successful', token, user: userResponseData },
      { status: 200 }
    );

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day in seconds (your JWT is 7d, consider matching this)
      path: '/',
    });
    console.log('Login successful, response sent with cookie.');

    return response;

  } catch (error) {
    console.error('API Login Error (caught in try-catch block):', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    console.log('--- API /api/auth/login POST request finished ---');
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}