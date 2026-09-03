import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import CommandPalette from "@/components/ui/CommandPalette";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "CodeGuard AI — Repository Security & Code Intelligence",
    template: "%s | CodeGuard AI",
  },
  description:
    "AI-powered developer security platform. Connect GitHub, scan repositories, detect vulnerabilities, and get intelligent engineering insights.",
  keywords: ["code security", "github", "ai", "code analysis", "vulnerability scanner", "developer tools"],
  openGraph: {
    type: "website",
    title: "CodeGuard AI — Repository Security & Code Intelligence",
    description:
      "AI-powered developer security platform. Connect GitHub, detect vulnerabilities, and get intelligent code insights.",
    siteName: "CodeGuard AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeGuard AI",
    description: "AI-powered developer security platform.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased font-sans">
        <CustomCursor />
        <CommandPalette />
        {children}
      </body>
    </html>
  );
}