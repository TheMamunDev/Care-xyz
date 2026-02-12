import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import BookingList from '@/components/bookings/BookingList/BookingList';

export const metadata = {
  title: 'My Bookings | Care.xyz',
};

export default async function MyBookingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }
  await connectDB();

  const bookingsData = await Booking.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  const bookings = bookingsData.map((booking: any) => ({
    ...booking,
    _id: booking._id.toString(),
    userId: booking.userId.toString(),
    date: booking.date.toISOString(),
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-secondary/20 py-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">
            Manage your upcoming and past care services.
          </p>
        </div>

        <BookingList initialBookings={bookings} />
      </div>
    </div>
  );
}
