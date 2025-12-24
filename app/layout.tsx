import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { ToastProvider } from "@/components/Toast";
import { KeyboardShortcutsProvider } from "@/components/KeyboardShortcutsProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CommandPalette } from "@/components/CommandPalette";
import { OnboardingProvider } from "@/components/Onboarding";
import { organizationSchema, softwareApplicationSchema, generateJsonLd } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://certiflow.ai'),
  title: {
    default: "CertiFlow AI | Agentic GRC & Continuous Compliance Platform",
    template: "%s | CertiFlow AI",
  },
  description:
    "Get audit-ready in 7 days, not 7 weeks. CertiFlow AI uses autonomous agents powered by Gemini to automate 95% of SOC 2, ISO 27001, HIPAA, and GDPR compliance work.",
  keywords: [
    "compliance automation",
    "SOC 2 automation",
    "ISO 27001 software",
    "HIPAA compliance platform",
    "GDPR compliance tool",
    "GRC platform",
    "security compliance",
    "audit automation",
    "agentic AI GRC",
    "Gemini AI compliance",
    "autonomous evidence collection",
    "continuous auditing",
    "Vanta alternative",
    "Drata alternative",
  ],
  authors: [{ name: "CertiFlow AI", url: "https://certiflow.ai" }],
  creator: "CertiFlow AI",
  publisher: "CertiFlow AI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://certiflow.ai",
    siteName: "CertiFlow AI",
    title: "CertiFlow AI | Get Audit-Ready in 7 Days",
    description: "Autonomous compliance agents that verify controls, collect evidence, and remediate issues in real-time. Stop paying the compliance tax.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CertiFlow AI - Agentic GRC Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CertiFlow AI | Agentic GRC Platform",
    description: "Get audit-ready in 7 days with 95% automation powered by Gemini AI.",
    images: ["/og-image.png"],
    creator: "@certiflowai",
  },
  alternates: {
    canonical: "https://certiflow.ai",
    languages: {
      'en-US': 'https://certiflow.ai',
      'en-GB': 'https://certiflow.ai/en-gb',
      'de-DE': 'https://certiflow.ai/de',
    },
  },
  category: "Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: generateJsonLd(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: generateJsonLd(softwareApplicationSchema) }}
        />
      </head>
      <body>
        <ErrorBoundary>
          <AuthProvider>
            <ToastProvider>
              <KeyboardShortcutsProvider>
                <OnboardingProvider>
                  {children}
                  <CommandPalette />
                </OnboardingProvider>
              </KeyboardShortcutsProvider>
            </ToastProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
