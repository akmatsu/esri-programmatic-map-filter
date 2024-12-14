import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MSB Programmatic Map Viewer',
  description: 'A proof-of-concept for programmatically rendering and filtering GIS layers.',
  openGraph: {
    locale: 'en_US',
    images: [
      {
        url: 'https://d1159zutbdy4l.cloudfront.net/public/uploads/9dad3c29-2e50-4d33-bf23-eed69a18abd8optimized_images/500x500_optimized_image.jpg',
        width: 500,
        height: 500,
      },
    ],
  },
  twitter: {
    images: [
      'https://d1159zutbdy4l.cloudfront.net/public/uploads/9dad3c29-2e50-4d33-bf23-eed69a18abd8optimized_images/500x500_optimized_image.jpg',
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
