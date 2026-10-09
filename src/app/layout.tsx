import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Wedding of Putra & Putri",
  description: "Undangan pernikahan digital - Moonlight Symphony",
  openGraph: {
    title: "The Wedding of Putra & Putri",
    description: "Kami mengundang Anda untuk hadir di hari bahagia kami",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
