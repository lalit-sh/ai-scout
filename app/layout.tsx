import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "AI Scout - AI Chat & Company Research Agent",
  description: "Analyze company AI initiatives and chat with Claude AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 font-sans">
        <Header />
        {children}
      </body>
    </html>
  );
}
