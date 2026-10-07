"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SiteConfig } from "@/lib/types";

interface NavItem {
  label: string;
  href: string;
}

interface HeaderProps {
  siteConfig: SiteConfig;
  mainNav: NavItem[];
}

export default function Header({ siteConfig, mainNav }: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-cream shadow-sm">
      <div className="bg-brand text-white text-xs sm:text-sm">
        <div className="container-page flex h-9 items-center justify-between">
          <span className="hidden sm:inline">{siteConfig.officeHours}</span>
          <div className="flex items-center gap-4 ml-auto">
            <a href={`tel:${siteConfig.phone}`} className="hover:underline">
              {siteConfig.phone}
            </a>
            <a href={`mailto:${siteConfig.email}`} className="hidden sm:inline hover:underline">
              {siteConfig.email}
            </a>
          </div>
        </div>
      </div>

      <div className="container-page flex h-20 items-center justify-between gap-6">
        <Link href="/" className="flex shrink-0 items-center" onClick={() => setOpen(false)}>
          <Image
            src="/images/logo-header.png"
            alt={siteConfig.name}
            width={1371}
            height={1034}
            priority
            className="h-12 w-auto sm:h-14"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {mainNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-3 py-2 text-sm font-medium text-ink/75 hover:text-brand transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          className="hidden lg:inline-flex items-center rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark transition-colors"
        >
          Talk to an Agent
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="lg:hidden text-ink p-2"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-black/5 bg-cream">
          <div className="container-page flex flex-col py-3">
            {mainNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium text-ink/75 border-b border-black/5 last:border-b-0 hover:text-brand"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Talk to an Agent
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
