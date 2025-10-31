import type { Metadata } from "next";
import { Host_Grotesk, Climate_Crisis } from "next/font/google";
import SessionManager from "@/components/SessionManager";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

const hostGrotesk = Host_Grotesk({
  variable: "--font-host",
  subsets: ["latin"],
});

const climateCrisis = Climate_Crisis({
  variable: "--font-climate",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Acess - Volvix",
  description: "Sistema de acesso e segurança da Volvix",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body
        className={`${hostGrotesk.variable} ${climateCrisis.variable} antialiased`}
      >
        <ThemeProvider>
          <SessionManager />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
