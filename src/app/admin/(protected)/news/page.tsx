import Link from "next/link";
import { getAllNews } from "@/data/news";
import { formatDate } from "@/lib/format";
import DeleteButton from "@/components/admin/DeleteButton";

export default function AdminNewsPage() {
  const posts = getAllNews();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">News Posts</h1>
          <p className="mt-1 text-sm text-body">{posts.length} articles</p>
        </div>
        <Link
          href="/admin/news/new"
          className="rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark transition-colors"
        >
          + Add Post
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-black/5 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-black/5 bg-cream text-xs uppercase text-body">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.slug} className="border-b border-black/5 last:border-b-0">
                <td className="px-4 py-3 font-medium text-heading">{post.title}</td>
                <td className="px-4 py-3 text-body">{post.category}</td>
                <td className="px-4 py-3 text-body">{formatDate(post.date)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/admin/news/${post.slug}`} className="text-sm font-medium text-brand hover:text-brand-dark">
                      Edit
                    </Link>
                    <DeleteButton
                      endpoint={`/api/admin/news/${post.slug}`}
                      confirmMessage={`Delete "${post.title}"? This cannot be undone.`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-body">
                  No news posts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
