import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bahi — The Simple All-in-One Business App',
  description:
    'The easiest way to run your business. Track customers, make sales, count stock, send bills, manage your team, and organize tasks all in one place.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-paper text-ink transition-colors duration-150" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('bahi-theme');
                if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="font-sans bg-paper dark:bg-[#141513] text-ink dark:text-[#F7F6F3] antialiased transition-colors duration-150">
        {children}
      </body>
    </html>
  );
}
