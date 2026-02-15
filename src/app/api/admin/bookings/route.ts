import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import User from '@/models/User';
import { revalidatePath } from 'next/cache';

// 1. GET ALL BOOKINGS (With Filters)
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || 'all';

  try {
    await connectDB();

    const query: any = {};
    if (status !== 'all') {
      query.status = status;
    }

    if (search) {
      const users = await User.find({
        $or: [
          { email: { $regex: search, $options: 'i' } },
          { fullName: { $regex: search, $options: 'i' } },
        ],
      }).select('_id');
      const userIds = users.map(u => u._id);

      query.$or = [
        { _id: { $regex: search, $options: 'i' } },
        { serviceName: { $regex: search, $options: 'i' } },
        { userId: { $in: userIds } },
      ];
    }

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(query)
      .populate('userId', 'fullName email image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(query);

    return NextResponse.json({
      bookings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching bookings' },
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
    const { bookingId, status } = await req.json();
    await connectDB();

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 },
      );
    }

    booking.status = status;
    await booking.save();
    revalidatePath('/my-bookings');

    return NextResponse.json({
      message: 'Status updated successfully',
      booking,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Update failed' }, { status: 500 });
  }
}
