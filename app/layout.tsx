import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { FirebaseProvider } from '@/components/FirebaseProvider';
import { GeolocationProvider } from '@/context/GeolocationContext';
import { AuthButton } from '@/components/AuthButton';
import { HeaderLocation } from '@/components/HeaderLocation';
import Link from 'next/link';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'CatWatch',
  description: 'Registre avistamentos de gatos de rua baseados na sua localização.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="flex flex-col h-[100dvh] w-full bg-slate-50 font-sans overflow-hidden text-slate-900" suppressHydrationWarning>
        <FirebaseProvider>
          <GeolocationProvider>
            <header className="h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between flex-shrink-0 relative z-[2000]">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-90 transition-opacity shrink-0">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.45.65.18.8 1.18.26 1.55l-2.41 1.65a8 8 0 0 1 .5 3.74c0 3.51-2.9 6.41-6.5 6.41S6.5 13.51 6.5 10c0-1.34.4-2.59 1.09-3.64l-2.41-1.65c-.54-.37-.39-1.37.26-1.55 1.39-.39 4.64.45 6.42 2.45.65-.17 1.33-.26 2-.26Z"/><path d="M8 14c.5 3 3 5 4 5s3.5-2 4-5"/><path d="M9 10h.01"/><path d="M15 10h.01"/></svg>
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-800">CatWatch</h1>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4 shrink-0 overflow-hidden">
              <HeaderLocation />
              <AuthButton />
            </div>
          </header>
          <main className="flex flex-1 overflow-hidden relative">
            {children}
          </main>
          </GeolocationProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}
