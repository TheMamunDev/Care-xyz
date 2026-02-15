import type { Metadata } from 'next';

import './globals.css';
import TanstackProvider from '@/components/providers/TanstackProvider';
import AuthProvider from '@/components/providers/AuthProvider';
import Navbar from '@/components/shared/NavBar/NavBar';
import Footer from '@/components/shared/Footer/Footer';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Care.xyz - Trusted Care Services',
  description: 'Find reliable babysitting and elderly care services.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TanstackProvider>
          <AuthProvider>
            <Toaster />
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
