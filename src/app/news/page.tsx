import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import { getAllNews } from "@/data/news";
import { formatDate } from "@/lib/format";
import { imageSource } from "@/lib/image";

export const metadata: Metadata = {
  title: "News & Events",
  description: "Market trends, buyer's guides, and development news for Pampanga real estate.",
};

export default function NewsPage() {
  const newsPosts = getAllNews();

  return (
    <div className="container-page py-12 lg:py-16">
      <SectionHeading
        eyebrow="News & Events"
        title="Insights on Pampanga Real Estate"
        description="Market trends, buyer's guides, and updates on the developments we work with."
      />

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {newsPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/news/${post.slug}`}
            className="group block overflow-hidden rounded-xl border border-black/5 shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                {...imageSource(post.image)}
                alt={post.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand">{post.category}</p>
              <h2 className="mt-1 font-bold text-heading group-hover:text-brand transition-colors">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-body line-clamp-3">{post.excerpt}</p>
              <p className="mt-3 text-xs text-body/70">{formatDate(post.date)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
