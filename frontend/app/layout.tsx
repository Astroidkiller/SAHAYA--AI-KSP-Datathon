import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SAHAYA AI — KSP Crime Intelligence Platform",
  description:
    "Conversational crime analytics assistant for Karnataka State Police. Suspect network analysis, hotspot detection, and multilingual voice input powered by Zoho Catalyst.",
  keywords: ["KSP", "crime intelligence", "SAHAYA", "Karnataka Police", "analytics"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // 1. Unregister all old Service Workers
                  if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(function(registrations) {
                      for (var i = 0; i < registrations.length; i++) {
                        registrations[i].unregister();
                      }
                    });
                  }
                  // 2. Clear CacheStorage
                  if ('caches' in window) {
                    caches.keys().then(function(names) {
                      for (var i = 0; i < names.length; i++) {
                        caches.delete(names[i]);
                      }
                    });
                  }
                  // 3. One-time version check to purge stale localStorage in normal Chrome
                  var CURRENT_VERSION = 'v2.5.0_clean';
                  var savedVer = localStorage.getItem('sahaya_build_ver');
                  if (savedVer !== CURRENT_VERSION) {
                    localStorage.clear();
                    sessionStorage.clear();
                    localStorage.setItem('sahaya_build_ver', CURRENT_VERSION);
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex bg-[var(--color-bg-primary)]">
        <Providers>
          <Sidebar />
          <main className="flex-1 ml-64 min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}

