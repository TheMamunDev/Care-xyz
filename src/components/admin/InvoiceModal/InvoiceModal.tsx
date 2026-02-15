'use client';

import { useRef } from 'react';
import { format } from 'date-fns';
import { Printer, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any; // The booking object
}

export default function InvoiceModal({
  isOpen,
  onClose,
  data,
}: InvoiceModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Invoice Details</DialogTitle>
        </DialogHeader>

        <div className="flex justify-end gap-2 mb-4 print:hidden">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Print Invoice
          </Button>
        </div>

        {/* --- PRINTABLE AREA --- */}
        <div
          ref={printRef}
          className="p-8 border rounded-lg bg-white text-gray-900 print:border-none"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-primary">Care.xyz</h1>
              <p className="text-sm text-gray-500 mt-1">
                Trusted Care Services
              </p>
              <div className="text-xs text-gray-500 mt-4">
                <p>Level 4, Care Tower</p>
                <p>Gulshan 1, Dhaka-1212</p>
                <p>support@care.xyz</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-800">INVOICE</h2>
              <p className="text-sm text-gray-500 mt-1">
                #{data._id.slice(-6).toUpperCase()}
              </p>
              <div className="mt-4 text-xs">
                <p>
                  <span className="font-semibold">Date:</span>{' '}
                  {format(new Date(data.createdAt), 'PPP')}
                </p>
                <p>
                  <span className="font-semibold">Transaction ID:</span>{' '}
                  {data.transactionId || 'CASH'}
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Bill To */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">
              Bill To
            </h3>
            <p className="font-bold text-lg">
              {data.userId?.fullName || 'Guest User'}
            </p>
            <p className="text-sm text-gray-600">{data.userId?.email}</p>
            <p className="text-sm text-gray-600 mt-1 max-w-xs">
              {data.location?.address}, {data.location?.district}
            </p>
          </div>

          {/* Table */}
          <table className="w-full mb-8">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 font-semibold text-sm">
                  Service Description
                </th>
                <th className="text-center py-3 font-semibold text-sm">
                  Duration
                </th>
                <th className="text-right py-3 font-semibold text-sm">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-4 text-sm">{data.serviceName}</td>
                <td className="text-center py-4 text-sm">
                  {data.duration} Hours
                </td>
                <td className="text-right py-4 text-sm font-medium">
                  ৳{data.totalCost}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-48 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span>৳{data.totalCost}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (0%):</span>
                <span>৳0.00</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-primary">৳{data.totalCost}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-xs text-gray-400">
            <p>
              Thank you for choosing Care.xyz. This is a computer-generated
              invoice.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
