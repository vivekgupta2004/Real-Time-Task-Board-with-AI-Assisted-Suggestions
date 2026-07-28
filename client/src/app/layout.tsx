import type { Metadata } from 'next';
import './globals.css';
import ToastProvider from '@/providers/ToastProvider';
import AuthProvider from '@/providers/AuthProvider';
import SocketProvider from '@/providers/SocketProvider';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';

export const metadata: Metadata = {
  title: 'Real-Time Task Board',
  description: 'Production-ready Real-Time Task Board Application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gray-50 flex flex-col">
        <AuthProvider>
          <SocketProvider>
            <ToastProvider />
            <Navbar />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 p-6">{children}</main>
            </div>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
