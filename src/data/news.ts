import { revalidatePath } from "next/cache";
import { readJsonFile, writeJsonFile } from "@/lib/json-store";
import { uniqueSlug } from "@/lib/slug";
import { NewsPost } from "@/lib/types";

const DATA_PATH = "news.json";

function readNews(): NewsPost[] {
  return readJsonFile<NewsPost[]>(DATA_PATH);
}

function writeNews(posts: NewsPost[]): void {
  writeJsonFile(DATA_PATH, posts);
}

function revalidateNewsPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/news");
  revalidatePath("/admin");
  revalidatePath("/admin/news");
  if (slug) revalidatePath(`/news/${slug}`);
}

export function getAllNews(): NewsPost[] {
  return readNews().sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getNewsBySlug(slug: string): NewsPost | undefined {
  return readNews().find((post) => post.slug === slug);
}

export function createNewsPost(input: Omit<NewsPost, "slug"> & { slug?: string }): NewsPost {
  const posts = readNews();
  const existingSlugs = posts.map((post) => post.slug);
  const slug = input.slug ? uniqueSlug(input.slug, existingSlugs) : uniqueSlug(input.title, existingSlugs);

  const post: NewsPost = { ...input, slug };
  writeNews([...posts, post]);
  revalidateNewsPaths(slug);
  return post;
}

export function updateNewsPost(currentSlug: string, input: Omit<NewsPost, "slug"> & { slug?: string }): NewsPost {
  const posts = readNews();
  const index = posts.findIndex((post) => post.slug === currentSlug);
  if (index === -1) {
    throw new Error(`News post not found: ${currentSlug}`);
  }

  const otherSlugs = posts.filter((_, i) => i !== index).map((post) => post.slug);
  const desiredSlug = input.slug || currentSlug;
  const nextSlug = desiredSlug === currentSlug ? currentSlug : uniqueSlug(desiredSlug, otherSlugs);

  const updated: NewsPost = { ...input, slug: nextSlug };
  const nextPosts = [...posts];
  nextPosts[index] = updated;
  writeNews(nextPosts);

  revalidateNewsPaths(currentSlug);
  if (nextSlug !== currentSlug) revalidateNewsPaths(nextSlug);

  return updated;
}

export function deleteNewsPost(slug: string): void {
  const posts = readNews();
  const next = posts.filter((post) => post.slug !== slug);
  writeNews(next);
  revalidateNewsPaths(slug);
}
