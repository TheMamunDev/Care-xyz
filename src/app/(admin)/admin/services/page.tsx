'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { Plus, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import EditServiceSheet from '@/components/admin/EditServiceSheet/EDitServiceSheet';

export default function AllServicesPage() {
  const queryClient = useQueryClient();
  const [editingService, setEditingService] = useState<any>(null);

  const { data: services, isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => {
      const res = await axios.get('/api/admin/services');
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return axios.delete(`/api/admin/services?id=${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Service deleted');
    },
    onError: () => toast.error('Failed to delete'),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Services
          </h2>
          <p className="text-slate-500 mt-1">
            Manage your service offerings and pricing.
          </p>
        </div>
        <Link href="/admin/services/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New Service
          </Button>
        </Link>
      </div>

      <div className="rounded-md border bg-white w-full overflow-x-auto">
        <Table className="min-w-0 w-full">
          <TableHeader className="bg-gray-50/50 hidden lg:table-header-group">
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Price / Hr</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Features</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="grid grid-cols-1 gap-4 lg:table-row-group">
            {isLoading ? (
              <TableRow className="flex flex-col border rounded-lg p-4 lg:p-0 lg:table-row lg:border-0">
                <TableCell
                  colSpan={6}
                  className="text-center py-10 block lg:table-cell"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : services?.length === 0 ? (
              <TableRow className="flex flex-col border rounded-lg p-4 lg:p-0 lg:table-row lg:border-0">
                <TableCell
                  colSpan={6}
                  className="text-center py-10 block lg:table-cell"
                >
                  No services found.
                </TableCell>
              </TableRow>
            ) : (
              services?.map((service: any) => (
                <TableRow
                  key={service._id}
                  className="flex flex-col h-full border rounded-lg shadow-sm lg:shadow-none lg:table-row lg:border-0 p-4 lg:p-0 space-y-4 lg:space-y-0 hover:bg-gray-50/50"
                >
                  <TableCell className="block lg:table-cell">
                    <Avatar className="h-10 w-10 rounded-lg">
                      <AvatarImage
                        src={service.image}
                        className="object-cover"
                      />
                      <AvatarFallback>SR</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium block lg:table-cell break-words">
                    <span className="text-xs text-gray-500 lg:hidden block mb-1">
                      Title
                    </span>
                    {service.title}
                  </TableCell>
                  <TableCell className="block lg:table-cell">
                    <span className="text-xs text-gray-500 lg:hidden block mb-1">
                      Price / Hr
                    </span>
                    ৳{service.pricePerHour}
                  </TableCell>
                  <TableCell className="block lg:table-cell">
                    <span className="text-xs text-gray-500 lg:hidden block mb-1">
                      Status
                    </span>
                    {service.isActive ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-xs text-gray-500 block lg:table-cell">
                    <span className="text-xs text-gray-500 lg:hidden block mb-1">
                      Features
                    </span>
                    {service.features?.join(', ')}
                  </TableCell>
                  <TableCell className="text-right block lg:table-cell">
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => setEditingService(service)}
                          >
                            <Pencil className="mr-2 h-4 w-4" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => {
                              if (confirm('Delete this service?'))
                                deleteMutation.mutate(service._id);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
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

      {editingService && (
        <EditServiceSheet
          service={editingService}
          isOpen={!!editingService}
          onClose={() => setEditingService(null)}
          onUpdate={() =>
            queryClient.invalidateQueries({ queryKey: ['admin-services'] })
          }
        />
      )}
    </div>
  );
}
