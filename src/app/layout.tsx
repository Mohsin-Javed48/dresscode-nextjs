import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/_styles/globals.css";
import ConditionalLayout from "@/app/_components/ConditionalLayout";
import { Suspense } from "react";
import Spinner from "./_components/Spinner";
import Providers from "./_components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | The Dresscode",
    default: "Welcome | The Dresscode",
  },
  description:
    "Discover stylish and trendy outfits at The Dresscode. Explore our curated collection of clothing, accessories, and fashion essentials designed to elevate your style for every occasion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Suspense fallback={<Spinner />}>
            <ConditionalLayout>{children}</ConditionalLayout>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
