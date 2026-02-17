'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import AdminSidebar from '../AdminSidebar/AdminSidebar';

export default function AdminNavbar() {
  return (
    <>
      <div className="flex items-center p-4 border-b bg-white md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 bg-gray-900 w-72 text-white border-none"
          >
            <AdminSidebar />
          </SheetContent>
        </Sheet>
        <div className="font-bold ml-4">Admin Dashboard</div>
      </div>
      <div className="font-bold hidden md:block p-4 border-b bg-white">
        Admin Dashboard
      </div>
    </>
  );
}
