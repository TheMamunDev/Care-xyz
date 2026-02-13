'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  Calendar,
  MapPin,
  Clock,
  CreditCard,
  XCircle,
  Eye,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Confirmed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Completed':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function BookingList({
  initialBookings,
}: {
  initialBookings: any[];
}) {
  const router = useRouter();
  const [bookings, setBookings] = useState(initialBookings);
  const [isLoading, setIsLoading] = useState(false);

  // State for View Details Modal
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error('Failed to cancel');

      toast('The Service has been cancelled.');
      setBookings(prev =>
        prev.map(b =>
          b._id === bookingId ? { ...b, status: 'Cancelled' } : b,
        ),
      );

      router.refresh();
    } catch (error) {
      toast('Could not cancel the booking.');
    } finally {
      setIsLoading(false);
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-dashed">
        <h3 className="text-xl font-semibold text-gray-900">
          No Bookings Found
        </h3>
        <p className="text-gray-500 mt-2">
          You haven't booked any care services yet.
        </p>
        <Button className="mt-4" onClick={() => router.push('/services')}>
          Find a Service
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {bookings.map(booking => (
          <Card
            key={booking._id}
            className="overflow-hidden !border-l-4 !border-l-primary border-0 shadow-sm hover:shadow-md transition-shadow"
          >
            <CardHeader className="bg-slate-50/50 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    {booking.serviceName}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(booking.date), 'PPP')}
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className={`${getStatusColor(booking.status)} font-semibold`}
                >
                  {booking.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Duration
                  </p>
                  <p className="font-medium">{booking.duration} Hours</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-full text-green-600">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Total Cost
                  </p>
                  <p className="font-medium text-lg text-primary font-bold">
                    ৳{booking.totalCost}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-full text-orange-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Location
                  </p>
                  <p
                    className="font-medium truncate max-w-[150px]"
                    title={booking.location.address}
                  >
                    {booking.location.district}
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 bg-gray-50/50 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedBooking(booking)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>

              {booking.status !== 'Cancelled' && (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => router.push(`/payment/${booking._id}`)}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay Now
                </Button>
              )}

              {booking.status === 'Pending' && (
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isLoading}
                  onClick={() => handleCancel(booking._id)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Booking
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* View Details Dialog */}
      <Dialog
        open={!!selectedBooking}
        onOpenChange={() => setSelectedBooking(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>ID: {selectedBooking?._id}</DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">
                  Service Address
                </label>
                <p className="text-gray-900 border p-2 rounded-md bg-gray-50">
                  {selectedBooking.location.address},{' '}
                  {selectedBooking.location.district},{' '}
                  {selectedBooking.location.division}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Service Type
                  </label>
                  <p className="font-medium">{selectedBooking.serviceName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Status
                  </label>
                  <p
                    className={`font-medium ${getStatusColor(selectedBooking.status).split(' ')[1]}`}
                  >
                    {selectedBooking.status}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
