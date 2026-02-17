'use client';
import { confirmAction } from '@/lib/sweetalert';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  MoreHorizontal,
  Trash2,
  ShieldCheck,
  Shield,
  User as UserIcon,
  Loader2,
  Search,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
export default function UsersTable() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await axios.get('/api/admin/users');
      return data;
    },
  });

  const actionMutation = useMutation({
    mutationFn: async ({
      userId,
      action,
    }: {
      userId: string;
      action: string;
    }) => {
      return axios.patch('/api/admin/users', { userId, action });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(
        variables.action === 'delete'
          ? 'User deleted successfully'
          : 'User role updated successfully',
      );
    },
    onError: () => {
      toast.error('Action failed. Please try again.');
    },
  });

  const filteredUsers = users?.filter(
    (user: any) =>
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Total Users:{' '}
          <span className="font-bold text-foreground">
            {users?.length || 0}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center h-24 text-muted-foreground"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}

            {filteredUsers?.map((user: any) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.image} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.fullName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user.fullName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span>{user.email}</span>
                    <span className="text-muted-foreground text-xs">
                      {user.contact}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {user.role === 'admin' ? (
                    <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-indigo-200 gap-1">
                      <ShieldCheck className="h-3 w-3" /> Admin
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-slate-600 gap-1">
                      <UserIcon className="h-3 w-3" /> User
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() =>
                          navigator.clipboard.writeText(user.email)
                        }
                      >
                        Copy Email ID
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          actionMutation.mutate({
                            userId: user._id,
                            action: 'toggle_role',
                          })
                        }
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={async () => {
                          const isConfirmed = await confirmAction({
                            title: 'Delete User?',
                            text: 'Are you sure you want to delete this user? This action cannot be undone.',
                            confirmButtonText: 'Yes, delete user',
                          });

                          if (isConfirmed) {
                            actionMutation.mutate({
                              userId: user._id,
                              action: 'delete',
                            });
                          }
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
