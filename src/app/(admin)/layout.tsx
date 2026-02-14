import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import AdminSidebar from '@/components/admin/AdminSidebar/AdminSidebar';
import AdminNavbar from '@/components/admin/AdminNavbar/AdminNavbar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="hidden md:flex w-72 flex-col bg-gray-900">
        <AdminSidebar />
      </aside>
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
