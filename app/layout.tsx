import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spark - Swipe, Match, Connect",
  description: "A modern dating experience inspired by Tinder, built for the web."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
