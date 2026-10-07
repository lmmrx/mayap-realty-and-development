import { notFound } from "next/navigation";
import { getListingBySlug } from "@/data/listings";
import ListingForm from "@/components/admin/ListingForm";

interface EditListingPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);

  if (!listing) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading">Edit Listing</h1>
      <p className="mt-1 text-sm text-body">{listing.title}</p>

      <div className="mt-6">
        <ListingForm initialListing={listing} />
      </div>
    </div>
  );
}
