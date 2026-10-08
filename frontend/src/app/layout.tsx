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
    <html lang="en" className="bg-paper text-ink">
      <body className="font-sans bg-paper text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
