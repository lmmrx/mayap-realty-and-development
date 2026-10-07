import NewsForm from "@/components/admin/NewsForm";

export default function NewNewsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-heading">Add News Post</h1>
      <p className="mt-1 text-sm text-body">Publish a new article.</p>

      <div className="mt-6">
        <NewsForm />
      </div>
    </div>
  );
}
