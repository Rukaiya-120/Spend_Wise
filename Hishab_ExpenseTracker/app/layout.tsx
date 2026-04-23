import type {Metadata} from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/lib/app-context';
import { RootContent } from '@/components/root-content';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Hishab - Expense Tracker',
  description: 'Clean personal and group expense tracking',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased text-gray-900 bg-[#f5f5f5]" suppressHydrationWarning>
        <AppProvider>
          <RootContent>{children}</RootContent>
        </AppProvider>
      </body>
    </html>
  );
}
