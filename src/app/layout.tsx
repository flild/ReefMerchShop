import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#e6f6fb' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: 'Reef | Типография для мерчеделов',
    template: '%s | Reef'
  },
  description: 'Типография для художников, авторов мерча и создателей коллекционных изделий. Печать акриловых брелоков, стендов и мерча на заказ.',
  keywords: ['мерч', 'акриловые брелоки', 'печать мерча', 'типография для художников', 'аниме мерч', 'Reef', 'печать на акриле', 'стенды', 'коллекты'],
  authors: [{ name: 'Reef' }],
  creator: 'Reef Studio',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://reef.com', // TODO: Замени на свой реальный домен
    title: 'Reef | Типография для мерчеделов',
    description: 'Специализированная типография для художников. Сделай свой идеальный мерч с нами.',
    siteName: 'Reef',
    images: [
      {
        url: '/og-image.jpg', // TODO: Закинь красивую картинку в папку public
        width: 1200,
        height: 630,
        alt: 'Reef Типография',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reef | Типография для мерчеделов',
    description: 'Типография для художников. Печать акриловых брелоков, стендов и мерча на заказ.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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