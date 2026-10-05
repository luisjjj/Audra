import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Audra — Every action. Accounted for.",
  description: "Collaborative audit and compliance workspace.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased" style={{ fontFamily: "Inter, Manrope, system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
