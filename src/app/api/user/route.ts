import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { z } from 'zod';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  contact: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().max(300, 'Bio must be less than 300 characters').optional(),
  image: z.string().url().optional(),
  nid: z.coerce.number().optional(),
});

export async function GET(req: Request) {
  console.log('enetrer');
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const user = await User.findById(session.user.id).select('-password');
    console.log(user);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const validation = profileSchema.safeParse(body);
    console.log(validation);

    if (!validation.success) {
      console.log(validation.error);
      return NextResponse.json(
        { message: 'Invalid data', errors: validation.error },
        { status: 400 },
      );
    }

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { ...validation.data },
      { new: true, runValidators: true },
    ).select('-password');

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ message: 'Update failed' }, { status: 500 });
  }
}
