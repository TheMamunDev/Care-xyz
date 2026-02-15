import PaymentsTable from '@/components/admin/PaymentTable/PaymentTable';

export default function PaymentHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Payment History
        </h2>
        <p className="text-slate-500 mt-1">
          View all successful transactions and generate invoices for
          bookkeeping.
        </p>
      </div>
      <PaymentsTable />
    </div>
  );
}
