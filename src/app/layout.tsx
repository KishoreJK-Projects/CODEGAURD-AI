import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import CommandPalette from "@/components/ui/CommandPalette";

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
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <CustomCursor />
        <CommandPalette />
        {children}
      </body>
    </html>
  );
}