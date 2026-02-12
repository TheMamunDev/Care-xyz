import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import Services from '@/models/Service';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { serviceId, serviceName, date, duration, location, email } = body;

    await connectDB();

    const serviceData = await Services.findOne({ id: serviceId });
    if (!serviceData) {
      return NextResponse.json(
        { message: 'Service not found' },
        { status: 404 },
      );
    }

    const totalCost = (Number(duration) || 0) * serviceData.pricePerHour;

    const newBooking = await Booking.create({
      userId: session.user.id,
      serviceId,
      serviceName,
      date,
      duration,
      totalCost,
      location,
      email,
      status: 'Pending',
    });

    return NextResponse.json(
      { message: 'Booking created successfully', booking: newBooking },
      { status: 201 },
    );
  } catch (error) {
    console.error('Booking Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
