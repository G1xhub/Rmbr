import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "rmbr - Your Notion-like Workspace",
  description: "A modern note-taking and project management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
