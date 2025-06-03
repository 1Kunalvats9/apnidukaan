// app/api/auth/signup/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDb from '../../../../lib/connectDb'; // Verify this path is correct
import User from '../../../../models/User';     // Verify this path is correct

export async function POST(request) {
  console.log('--- API /api/auth/signup POST request received ---');
  await connectDb();

  try {
    const {
      shopName,
      ownerName,
      email,
      password, // This is the plain-text password from the frontend
      location,
      category,
      phoneNumber
    } = await request.json();

    console.log('Signup data received for email:', email);
    // console.log('Password received (for debug, remove in prod):', password); // DANGER: Do not log plain passwords in production!

    if (!shopName || !ownerName || !email || !password || !location || !category || !phoneNumber) {
      console.log('Error: All fields are required.');
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Error: User with this email already exists:', email);
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    console.log('Creating new User instance...');
    const newUser = new User({
      shopName,
      ownerName,
      email,
      password, // Mongoose's pre-save hook will hash this
      location,
      category,
      phoneNumber
    });

    console.log('Attempting to save new user...');
    await newUser.save(); // This is where the pre-save hook should trigger
    console.log('New user saved successfully to DB (ID:', newUser._id, ')');

    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log('JWT generated for new user.');

    const userResponseData = {
      _id: newUser._id,
      shopName: newUser.shopName,
      ownerName: newUser.ownerName,
      email: newUser.email,
      location: newUser.location,
      category: newUser.category,
      phoneNumber: newUser.phoneNumber,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    const response = NextResponse.json(
      { message: 'Registration successful', token, user: userResponseData },
      { status: 201 }
    );

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    });
    console.log('Signup successful, response sent with cookie.');

    return response;

  } catch (error) {
    console.error('API Signup Error (caught in try-catch block):', error);

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error during registration' },
      { status: 500 }
    );
  } finally {
    console.log('--- API /api/auth/signup POST request finished ---');
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}