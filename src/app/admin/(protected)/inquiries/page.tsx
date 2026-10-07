import { getAllInquiries } from "@/data/inquiries";
import InquiryActions from "@/components/admin/InquiryActions";

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminInquiriesPage() {
  const inquiries = getAllInquiries();
  const unreadCount = inquiries.filter((inquiry) => !inquiry.read).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading">Inquiries</h1>
      <p className="mt-1 text-sm text-body">
        {inquiries.length} total &middot; {unreadCount} unread
      </p>

      <div className="mt-6 space-y-4">
        {inquiries.map((inquiry) => (
          <div
            key={inquiry.id}
            className={`rounded-xl border bg-white p-5 shadow-sm ${
              inquiry.read ? "border-black/5" : "border-brand/30"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-heading">{inquiry.name}</h2>
                  {!inquiry.read && (
                    <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                      New
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-body">
                  {inquiry.phone} &middot; {inquiry.email}
                </p>
                {inquiry.property && (
                  <p className="mt-1 text-xs font-semibold text-brand">Re: {inquiry.property}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-body">{formatDateTime(inquiry.createdAt)}</p>
                <div className="mt-2">
                  <InquiryActions id={inquiry.id} read={inquiry.read} />
                </div>
              </div>
            </div>
            {inquiry.message && <p className="mt-3 text-sm text-body leading-relaxed">{inquiry.message}</p>}
          </div>
        ))}

        {inquiries.length === 0 && (
          <div className="rounded-xl border border-dashed border-black/10 p-12 text-center text-body">
            No inquiries yet.
          </div>
        )}
      </div>
    </div>
  );
}
