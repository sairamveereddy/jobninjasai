import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { CopilotChat } from "@/components/copilot/copilot-chat";
import { OG_IMAGE, SITE_DESCRIPTION, SITE_TITLE } from "@/lib/marketing/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jobninjas.ai"),
  title: {
    default: SITE_TITLE,
    template: "%s · JobNinjas",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "AI recruiting platform",
    "autonomous hiring agents",
    "AI resume screening",
    "technical interview analysis",
    "recruiting automation",
    "visual hiring workflow",
    "candidate concierge",
    "Ophelia OS hiring",
    "recruitment operations",
    "hiring operating system",
  ],
  authors: [{ name: "JobNinjas", url: "https://jobninjas.ai" }],
  creator: "JobNinjas",
  publisher: "JobNinjas",
  alternates: {
    canonical: "https://jobninjas.ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "JobNinjas",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "https://jobninjas.ai",
    locale: "en_US",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  icons: {
    icon: "/logo.png",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "JobNinjas",
      "url": "https://jobninjas.ai",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "description": SITE_DESCRIPTION,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "featureList": [
        "15 Specialized Autonomous AI Recruiting Agents",
        "Infinite Visual Pipeline Canvas for Roles",
        "Resume Parsing and Objective Scorecard Matching",
        "Deep Interview Transcript Scoring with Quoted Signals",
        "Candidate Travel Concierge with Ophelia Integration",
        "Greenhouse and ATS Ingestion",
      ],
    },
    {
      "@type": "Organization",
      "name": "JobNinjas",
      "url": "https://jobninjas.ai",
      "logo": "https://jobninjas.ai/logo.png",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <CopilotChat />
        </ThemeProvider>
      </body>
    </html>
  );
}

