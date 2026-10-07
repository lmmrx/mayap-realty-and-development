import ListingForm from "@/components/admin/ListingForm";

export default function NewListingPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-heading">Add Listing</h1>
      <p className="mt-1 text-sm text-body">Create a new property listing.</p>

      <div className="mt-6">
        <ListingForm />
      </div>
    </div>
  );
}
