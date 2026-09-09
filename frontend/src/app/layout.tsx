import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bahi — Multi-Tenant Business Suite',
  description:
    'Run CRM, Sales, Inventory, Accounting, HR, and Project Management on one unified platform. Built for modern businesses.',
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
