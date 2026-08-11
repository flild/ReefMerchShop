import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'Reef | Типография для мерчеделов',
  description: 'Типография для художников, авторов мерча и создателей коллекционных изделий.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-reef-light dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans selection:bg-reef-cyan selection:text-white" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
