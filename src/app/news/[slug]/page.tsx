import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllNews, getNewsBySlug } from "@/data/news";
import { formatDate } from "@/lib/format";
import { imageSource } from "@/lib/image";

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllNews().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getNewsBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const post = getNewsBySlug(slug);

  if (!post) notFound();

  return (
    <article className="container-page py-12 lg:py-16">
      <nav className="text-sm text-body mb-6">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/news" className="hover:text-brand">
          News
        </Link>
        <span className="mx-2">/</span>
        <span className="text-heading">{post.title}</span>
      </nav>

      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">{post.category}</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-heading tracking-tight">{post.title}</h1>
        <p className="mt-3 text-sm text-body">{formatDate(post.date)}</p>

        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl">
          <Image {...imageSource(post.image)} alt={post.title} fill className="object-cover" priority />
        </div>

        <div className="mt-8 space-y-5 text-body leading-relaxed">
          {post.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-10 border-t border-black/5 pt-6">
          <Link href="/news" className="text-sm font-semibold text-brand hover:text-brand-dark">
            &larr; Back to all articles
          </Link>
        </div>
      </div>
    </article>
  );
}
