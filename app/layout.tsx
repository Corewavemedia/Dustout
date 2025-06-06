import { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Dustout - Professional Cleaning Services',
  description: 'Professional cleaning services for homes and businesses. We clean so you don\'t have to.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body className="bg-white text-black font-poppins">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
