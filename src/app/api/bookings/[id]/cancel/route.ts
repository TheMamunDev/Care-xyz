import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const booking = await Booking.findOne({ _id: id });

    if (!booking) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 },
      );
    }

    if (booking.userId.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    booking.status = 'Cancelled';
    await booking.save();

    return NextResponse.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
