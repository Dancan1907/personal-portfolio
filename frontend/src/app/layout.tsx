// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import ToastProvider from "@/components/toast-provider";
// IMPORT THE NAVBAR
import Navbar from "@/components/shared/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Dancan Kalerwa | Portfolio",
    template: "%s | Dancan Kalerwa",
  },
  description:
    "Full-stack developer portfolio showcasing projects, skills, and experience.",
  openGraph: {
    title: "Dancan Kalerwa | Portfolio",
    description:
      "Full-stack developer portfolio showcasing projects, skills, and experience.",
    url: "https://your-portfolio.com",
    siteName: "Dancan Kalerwa",
    images: [
      {
        url: "https://your-portfolio.com/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            {/* ADD THE NAVBAR HERE */}
            <Navbar />
            {children}
            <ToastProvider />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
