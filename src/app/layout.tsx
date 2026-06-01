import type { Metadata } from "next";
import { Montserrat, Inter } from 'next/font/google';
import "./globals.css";
import "../styles/print.css";

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "WorkflowCV Studio | CVForge AI",
  description: "Advanced Document Templatization Studio. Reverse-engineer career records into schema-driven, print-perfect A4 CV assets using factual AI tailoring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${montserrat.variable} ${inter.variable} font-sans h-full antialiased`}>
        {children}
      </body>
    </html>
  );
}
