import Image from "next/image";
import Link from "next/link";
import { SiteConfig } from "@/lib/types";

interface NavItem {
  label: string;
  href: string;
}

interface FooterProps {
  siteConfig: SiteConfig;
  mainNav: NavItem[];
}

export default function Footer({ siteConfig, mainNav }: FooterProps) {
  return (
    <footer className="border-t border-black/5 bg-cream text-ink/70">
      <div className="container-page py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image
            src="/images/logo-header.png"
            alt={siteConfig.name}
            width={1371}
            height={1034}
            className="mb-4 h-14 w-auto"
          />
          <p className="text-sm leading-relaxed">{siteConfig.description}</p>
        </div>

        <div>
          <h3 className="text-ink font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {mainNav.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="hover:text-brand transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-ink font-semibold mb-4">Properties</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/listings?type=house-and-lot" className="hover:text-brand transition-colors">
                House and Lot
              </Link>
            </li>
            <li>
              <Link href="/listings?type=condo" className="hover:text-brand transition-colors">
                Condominiums
              </Link>
            </li>
            <li>
              <Link href="/listings?type=other" className="hover:text-brand transition-colors">
                Other Properties
              </Link>
            </li>
            <li>
              <Link href="/listings" className="hover:text-brand transition-colors">
                All Listings
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-ink font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li>{siteConfig.address}</li>
            <li>
              <a href={`tel:${siteConfig.phone}`} className="hover:text-brand transition-colors">
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-brand transition-colors">
                {siteConfig.email}
              </a>
            </li>
            <li>{siteConfig.officeHours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-black/5">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href={siteConfig.social.facebook} className="hover:text-brand transition-colors">
              Facebook
            </a>
            <a href={siteConfig.social.instagram} className="hover:text-brand transition-colors">
              Instagram
            </a>
            <a href={siteConfig.social.youtube} className="hover:text-brand transition-colors">
              YouTube
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
