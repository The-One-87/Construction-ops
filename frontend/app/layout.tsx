import "./globals.css";
import React from "react";

export const metadata = {
  title: "Construction Ops",
  description: "Multi-tenant service operations SaaS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
