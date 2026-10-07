import { notFound } from "next/navigation";
import { getNewsBySlug } from "@/data/news";
import NewsForm from "@/components/admin/NewsForm";

interface EditNewsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const { slug } = await params;
  const post = getNewsBySlug(slug);

  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading">Edit News Post</h1>
      <p className="mt-1 text-sm text-body">{post.title}</p>

      <div className="mt-6">
        <NewsForm initialPost={post} />
      </div>
    </div>
  );
}
