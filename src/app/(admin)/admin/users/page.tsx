import UsersTable from '@/components/admin/Userstable/UsersTable';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function ManageUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Manage Users
          </h2>
          <p className="text-slate-500 mt-1">
            View, search, and manage all registered users on the platform.
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <UsersTable />
    </div>
  );
}
