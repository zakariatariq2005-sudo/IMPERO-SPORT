import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PadelConnect - Connect with Padel Players",
  description: "Find and play padel matches with players around you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


