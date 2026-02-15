'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import {
  Search,
  FileText,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Banknote,
} from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import InvoiceModal from '@/components/admin/InvoiceModal/InvoiceModal';

export default function PaymentsTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-payments', page, search],
    queryFn: async () => {
      const res = await axios.get(
        `/api/admin/payments?page=${page}&limit=10&search=${search}`,
      );
      return res.data;
    },
  });

  return (
    <div className="min-h-full p-4 md:p-10 max-w-7xl mx-auto space-y-12 relative overflow-hidden">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search Transaction ID or User..."
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="text-sm text-gray-500">Showing Paid Transactions</div>
      </div>

      <div className="rounded-md border bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Invoice</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell
                    colSpan={7}
                    className="h-12 animate-pulse bg-gray-50/50"
                  />
                </TableRow>
              ))
            ) : data?.payments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center h-32 text-gray-500"
                >
                  No payment records found.
                </TableCell>
              </TableRow>
            ) : (
              data?.payments.map((payment: any) => (
                <TableRow key={payment._id} className="hover:bg-gray-50/50">
                  <TableCell className="font-mono text-xs text-gray-600">
                    {payment.transactionId ? (
                      <span className="bg-slate-100 px-2 py-1 rounded border">
                        {payment.transactionId}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">--</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-gray-900">
                        {payment.userId?.fullName || 'Unknown'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {payment.userId?.email}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm">
                    {payment.serviceName}
                  </TableCell>

                  <TableCell>
                    <div className="font-bold text-green-700">
                      ৳{payment.totalCost}
                    </div>
                  </TableCell>

                  <TableCell>
                    {payment.paymentPreference === 'pay-now' ? (
                      <Badge
                        variant="outline"
                        className="bg-indigo-50 text-indigo-700 border-indigo-200"
                      >
                        <CreditCard className="w-3 h-3 mr-1" /> Online
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-orange-50 text-orange-700 border-orange-200"
                      >
                        <Banknote className="w-3 h-3 mr-1" /> Cash
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-xs text-gray-500">
                    {format(new Date(payment.updatedAt), 'MMM d, yyyy')}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => setSelectedInvoice(payment)}
                    >
                      <FileText className="w-4 h-4 mr-1" /> View Invoice
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {data && data.pagination.totalPages > 1 && (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPage(p => Math.min(data.pagination.totalPages, p + 1))
            }
            disabled={page === data.pagination.totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <InvoiceModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        data={selectedInvoice}
      />
    </div>
  );
}
