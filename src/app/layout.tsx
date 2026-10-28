import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Analytics } from '@vercel/analytics/next';
import { CleanUrl } from '@/components/clean-url';
import { ContentProtection } from '@/components/content-protection';

export const metadata = {
  title: 'Faycal´s portfolio',
  description: 'Fayçal Lahri - Software Engineer & Full-Stack Developer. Portfolio personnel monochrome conçu selon le système de design Apple.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.svg',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Faycal´s portfolio" />
      </head>
      <body
        suppressHydrationWarning
        className="antialiased bg-background text-foreground selection:bg-foreground selection:text-background min-h-screen"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ContentProtection />
          <CleanUrl />
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
