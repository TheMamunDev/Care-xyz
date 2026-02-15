import BookingsTable from '@/components/admin/BookingsTable/BookingsTable';

export default function AdminBookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          All Bookings
        </h2>
        <p className="text-slate-500 mt-1">
          Monitor and manage all service requests. Filter by status or search
          for specific users.
        </p>
      </div>
      <BookingsTable />
    </div>
  );
}
