'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  MoreHorizontal,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Confirmed':
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Confirmed
        </Badge>
      );
    case 'Completed':
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
        </Badge>
      );
    case 'Ongoing':
      return (
        <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-indigo-200">
          <PlayCircle className="w-3 h-3 mr-1" /> Ongoing
        </Badge>
      );
    case 'Cancelled':
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">
          <XCircle className="w-3 h-3 mr-1" /> Cancelled
        </Badge>
      );
    case 'Rejected':
      return (
        <Badge variant="destructive" className="bg-red-600">
          <AlertCircle className="w-3 h-3 mr-1" /> Rejected
        </Badge>
      );
    default:
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" /> Pending
        </Badge>
      );
  }
};

export default function BookingsTable() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-bookings', page, search, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search,
        status: statusFilter,
      });
      const res = await axios.get(`/api/admin/bookings?${params.toString()}`);
      return res.data;
    },
    placeholderData: prev => prev,
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return axios.patch('/api/admin/bookings', { bookingId: id, status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success('Status updated successfully');
    },
    onError: () => toast.error('Failed to update status'),
  });

  const handleStatusChange = (id: string, status: string) => {
    statusMutation.mutate({ id, status });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search User, ID, Service..."
            className="pl-9 w-full"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select
            value={statusFilter}
            onValueChange={val => {
              setStatusFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Ongoing">Ongoing</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <div className="w-full overflow-x-auto">
          <Table className="min-w-0 w-full">
            <TableHeader className="bg-gray-50/50 hidden lg:table-header-group">
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Service Info</TableHead>
                <TableHead>Date & Location</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="grid grid-cols-1 gap-4 lg:table-row-group">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow
                    key={i}
                    className="flex flex-col h-full border rounded-lg p-4 lg:p-0 space-y-3 lg:space-y-0 lg:table-row lg:border-0"
                  >
                    <TableCell className="block lg:table-cell">
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : data?.bookings.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center h-32 text-gray-500"
                  >
                    No bookings found.
                  </TableCell>
                </TableRow>
              ) : (
                data?.bookings.map((booking: any) => (
                  <TableRow
                    key={booking._id}
                    className="flex flex-col h-full border rounded-lg shadow-sm lg:shadow-none lg:table-row lg:border-0 p-4 lg:p-0 space-y-4 lg:space-y-0 hover:bg-gray-50/50"
                  >
                    <TableCell className="block lg:table-cell break-all whitespace-normal lg:whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border">
                          <AvatarImage src={booking.userId?.image} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {booking.userId?.fullName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm text-gray-900">
                            {booking.userId?.fullName || 'Unknown'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {booking.userId?.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="block lg:table-cell break-words whitespace-normal lg:whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 lg:hidden">
                          Service
                        </span>
                        <span className="font-medium text-gray-900">
                          {booking.serviceName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {booking.duration} Hours
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="block lg:table-cell">
                      <div className="flex flex-col text-sm">
                        <span className="text-xs text-gray-500 lg:hidden">
                          Date
                        </span>
                        <span className="text-gray-700 font-medium">
                          {format(new Date(booking.date), 'MMM d, yyyy')}
                        </span>
                        <span className="text-xs text-gray-500 truncate">
                          {booking.location?.district}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="block lg:table-cell">
                      <div>
                        <span className="text-xs text-gray-500 lg:hidden">
                          Cost
                        </span>
                        <div className="font-bold text-gray-900">
                          ৳{booking.totalCost}
                        </div>
                        <span className="text-[10px] text-gray-500 uppercase">
                          {booking.paymentStatus}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="block lg:table-cell">
                      <div>
                        <span className="text-xs text-gray-500 lg:hidden">
                          Status
                        </span>
                        {getStatusBadge(booking.status)}
                      </div>
                    </TableCell>

                    <TableCell className="block lg:table-cell lg:text-right">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                            >
                              <MoreHorizontal className="h-4 w-4 text-gray-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(booking._id, 'Confirmed')
                              }
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                              Mark Confirmed
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(booking._id, 'Ongoing')
                              }
                            >
                              <PlayCircle className="mr-2 h-4 w-4 text-indigo-600" />
                              Mark Ongoing
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(booking._id, 'Completed')
                              }
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4 text-blue-600" />
                              Mark Completed
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(booking._id, 'Rejected')
                              }
                              className="text-red-600 focus:text-red-600"
                            >
                              <AlertCircle className="mr-2 h-4 w-4" />
                              Reject Request
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(booking._id, 'Cancelled')
                              }
                              className="text-gray-500"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Cancel
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {data && data.pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-center justify-between px-2">
          <div className="text-sm text-gray-500">
            Page {data.pagination.page} of {data.pagination.totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPage(p => Math.min(data.pagination.totalPages, p + 1))
              }
              disabled={page === data.pagination.totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
