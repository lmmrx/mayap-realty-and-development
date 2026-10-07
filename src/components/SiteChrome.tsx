"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SiteConfig } from "@/lib/types";

interface NavItem {
  label: string;
  href: string;
}

interface SiteChromeProps {
  siteConfig: SiteConfig;
  mainNav: NavItem[];
  children: ReactNode;
}

export default function SiteChrome({ siteConfig, mainNav, children }: SiteChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header siteConfig={siteConfig} mainNav={mainNav} />
      <main className="flex-1">{children}</main>
      <Footer siteConfig={siteConfig} mainNav={mainNav} />
    </>
  );
}
