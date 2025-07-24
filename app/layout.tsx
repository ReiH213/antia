import type { Metadata } from "next";
import "./globals.css";
import { homemade } from "./fonts";

export const metadata: Metadata = {
  title: "Meti&Antia",
  description: "Ftesa Jone",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/dark.svg",
        href: "/dark.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/light.svg",
        href: "/light.svg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${homemade.className}`}>
      <body className="bg-ivory text-stone-800 antialiased selection:bg-stone-800 selection:text-ivory">
        {children}
      </body>
    </html>
  );
}
