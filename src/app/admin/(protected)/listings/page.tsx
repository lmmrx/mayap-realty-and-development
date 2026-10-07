import Link from "next/link";
import { getAllListings } from "@/data/listings";
import { propertyTypeLabels } from "@/data/site";
import { formatPrice } from "@/lib/format";
import DeleteButton from "@/components/admin/DeleteButton";

export default function AdminListingsPage() {
  const listings = getAllListings();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Listings</h1>
          <p className="mt-1 text-sm text-body">{listings.length} properties</p>
        </div>
        <Link
          href="/admin/listings/new"
          className="rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark transition-colors"
        >
          + Add Listing
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-black/5 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-black/5 bg-cream text-xs uppercase text-body">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing.slug} className="border-b border-black/5 last:border-b-0">
                <td className="px-4 py-3 font-medium text-heading">{listing.title}</td>
                <td className="px-4 py-3 text-body">{propertyTypeLabels[listing.type]}</td>
                <td className="px-4 py-3 text-body">{listing.city}</td>
                <td className="px-4 py-3 text-body">{formatPrice(listing.priceFrom)}</td>
                <td className="px-4 py-3 text-body capitalize">{listing.status.replace("-", " ")}</td>
                <td className="px-4 py-3 text-body">{listing.featured ? "Yes" : "No"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/admin/listings/${listing.slug}`} className="text-sm font-medium text-brand hover:text-brand-dark">
                      Edit
                    </Link>
                    <DeleteButton
                      endpoint={`/api/admin/listings/${listing.slug}`}
                      confirmMessage={`Delete "${listing.title}"? This cannot be undone.`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {listings.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-body">
                  No listings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
