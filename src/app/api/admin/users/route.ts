import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    await connectDB();
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching users' },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const { userId, action } = await req.json();
    await connectDB();

    if (action === 'delete') {
      await User.findByIdAndDelete(userId);
      return NextResponse.json({ message: 'User deleted successfully' });
    }

    if (action === 'toggle_role') {
      const user = await User.findById(userId);
      user.role = user.role === 'admin' ? 'user' : 'admin';
      await user.save();
      return NextResponse.json({
        message: 'User role updated',
        role: user.role,
      });
    }

    return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: 'Operation failed' }, { status: 500 });
  }
}
