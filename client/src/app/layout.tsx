import type { Metadata } from 'next';
import './globals.css';
import ToastProvider from '@/providers/ToastProvider';
import AuthProvider from '@/providers/AuthProvider';
import SocketProvider from '@/providers/SocketProvider';
import Navbar from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'TaskBoardAiX21cc',
  description: 'TaskBoardAiX21cc - Real-Time Task Board with AI-Assisted Suggestions',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
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

