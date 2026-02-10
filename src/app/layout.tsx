import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import TanstackProvider from '@/components/providers/TanstackProvider';
import Navbar from '@/components/shared/NavBar/NavBar';
import Footer from '@/components/shared/Footer/Footer';

const inter = Inter({ subsets: ['latin'] });

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
      <body className={inter.className}>
        <TanstackProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </TanstackProvider>
      </body>
    </html>
  );
}
