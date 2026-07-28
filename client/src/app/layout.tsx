import type { Metadata } from 'next';
import './globals.css';
import ToastProvider from '@/providers/ToastProvider';
import AuthProvider from '@/providers/AuthProvider';
import SocketProvider from '@/providers/SocketProvider';
import Navbar from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'Real-Time Task Board',
  description: 'Production-ready Real-Time Task Board Application',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 flex flex-col">
        <AuthProvider>
          <SocketProvider>
            <ToastProvider />
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

