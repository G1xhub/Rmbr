import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "rmbr - Your Notion-like Workspace",
  description: "A modern note-taking and project management app",
};

import { ThemeProvider } from "@/components/theme-provider";

// ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
