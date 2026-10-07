import Link from "next/link";
import { getAllListings } from "@/data/listings";
import { getAllNews } from "@/data/news";
import { getAllInquiries, getUnreadInquiryCount } from "@/data/inquiries";

export default function AdminDashboardPage() {
  const listings = getAllListings();
  const news = getAllNews();
  const inquiries = getAllInquiries();
  const unreadInquiries = getUnreadInquiryCount();

  const cards = [
    {
      label: "Listings",
      count: listings.length,
      href: "/admin/listings",
      description: "Add, edit, or remove property listings.",
    },
    {
      label: "News Posts",
      count: news.length,
      href: "/admin/news",
      description: "Publish market updates and articles.",
    },
    {
      label: "Inquiries",
      count: inquiries.length,
      badge: unreadInquiries > 0 ? unreadInquiries : null,
      href: "/admin/inquiries",
      description: "Leads submitted through the contact and listing forms.",
    },
    {
      label: "Site Settings",
      count: null,
      href: "/admin/settings",
      description: "Update contact info, tagline, and social links.",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading">Dashboard</h1>
      <p className="mt-1 text-sm text-body">Manage your website content below.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border border-black/5 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-baseline justify-between">
              <h2 className="font-bold text-heading">{card.label}</h2>
              {card.count !== null && <span className="text-2xl font-bold text-brand">{card.count}</span>}
            </div>
            {card.badge ? (
              <p className="mt-2 text-xs font-semibold text-brand">{card.badge} unread</p>
            ) : (
              <p className="mt-2 text-sm text-body">{card.description}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
