import './globals.css';
import { Toaster } from 'sonner';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Auth0Client } from '@auth0/nextjs-auth0/server';
import { AuthProvider } from '@/context/Auth0Provider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`dark:bg-gray-900`}>
        <ThemeProvider>
          <Toaster />
          <AuthProvider>
          <SidebarProvider>{children}</SidebarProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
