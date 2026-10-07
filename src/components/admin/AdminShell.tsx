"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Listings", href: "/admin/listings" },
  { label: "News", href: "/admin/news" },
  { label: "Inquiries", href: "/admin/inquiries" },
  { label: "Site Settings", href: "/admin/settings" },
];

export default function AdminShell({
  children,
  unreadInquiries = 0,
}: {
  children: ReactNode;
  unreadInquiries?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function renderBadge(href: string) {
    if (href !== "/admin/inquiries" || unreadInquiries === 0) return null;
    return (
      <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
        {unreadInquiries}
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-ink text-white">
        <div className="container-page flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-bold">Mayap Admin</span>
            <nav className="hidden sm:flex items-center gap-1">
              {navItems.map((item) => {
                const active = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      active ? "bg-brand text-white" : "text-white/75 hover:text-white"
                    }`}
                  >
                    {item.label}
                    {renderBadge(item.href)}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-sm text-white/75 hover:text-white">
              View Site &rarr;
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md border border-white/20 px-3 py-1.5 text-sm font-medium hover:bg-white/10"
            >
              Logout
            </button>
          </div>
        </div>
        <nav className="flex sm:hidden container-page gap-1 pb-3">
          {navItems.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                  active ? "bg-brand text-white" : "text-white/75 hover:text-white"
                }`}
              >
                {item.label}
                {renderBadge(item.href)}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="container-page py-10">{children}</main>
    </div>
  );
}
