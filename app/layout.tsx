import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/layout/Navbar";
import SmoothScrolling from "@/components/providers/smooth-scroll";
import ModalProvider from "@/components/modal/modal-provider";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StudyGen AI",
  description: "The ultimate student tool for studying and learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <ModalProvider />
          <SmoothScrolling>
            {children}
          </SmoothScrolling>
        </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
