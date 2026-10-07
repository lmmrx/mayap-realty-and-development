import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { getSiteConfig, mainNav } from "@/data/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = getSiteConfig();
  return {
    title: {
      default: `${siteConfig.name} | ${siteConfig.tagline}`,
      template: `%s | ${siteConfig.shortName}`,
    },
    description: siteConfig.description,
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  const siteConfig = getSiteConfig();

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SiteChrome siteConfig={siteConfig} mainNav={mainNav}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
