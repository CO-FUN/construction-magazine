"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen relative`} 
        style={{
          background: 'radial-gradient(ellipse at top left, #3b82f6 0%, #6ee7b7 100%)'
        }}
      >
        <div className="absolute inset-0 z-0 animate-bg-move" style={{ pointerEvents: 'none', opacity: 0.3 }}>
          {/* Animated background layer, can be replaced with canvas/WebGL for more effects */}
        </div>
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Wizard Stepper will be rendered in page.tsx for step awareness */}
          {children}
        </div>
        <style jsx global>{`
          @keyframes bg-move {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }
          .animate-bg-move {
            background: linear-gradient(120deg, #3b82f6 0%, #6ee7b7 100%);
            background-size: 200% 200%;
            animation: bg-move 20s linear infinite alternate;
            width: 100vw;
            height: 100vh;
            position: absolute;
            top: 0;
            left: 0;
          }
        `}</style>
      </body>
    </html>
  );
}
