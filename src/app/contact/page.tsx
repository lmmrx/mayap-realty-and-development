import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import InquiryForm from "@/components/InquiryForm";
import { getSiteConfig } from "@/data/site";

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = getSiteConfig();
  return {
    title: "Contact Us",
    description: `Get in touch with ${siteConfig.name} for inquiries, site visits, and property assistance.`,
  };
}

export default function ContactPage() {
  const siteConfig = getSiteConfig();

  return (
    <div className="container-page py-12 lg:py-16">
      <SectionHeading
        eyebrow="Get in Touch"
        title="Talk to Our Team"
        description="Have a question about a listing, financing, or titling? Send us a message and we'll respond as soon as possible."
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="rounded-xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <InquiryForm />
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-black/5 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-heading mb-4">Office</h3>
            <ul className="space-y-3 text-sm text-body">
              <li>{siteConfig.address}</li>
              <li>{siteConfig.officeHours}</li>
            </ul>
          </div>

          <div className="rounded-xl border border-black/5 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-heading mb-4">Direct Contact</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <p className="text-body text-xs">Phone</p>
                <a href={`tel:${siteConfig.phone}`} className="font-semibold text-brand">
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <p className="text-body text-xs">Email</p>
                <a href={`mailto:${siteConfig.email}`} className="font-semibold text-brand">
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="overflow-hidden rounded-xl border border-black/5">
            <iframe
              title="Office location map"
              src="https://www.google.com/maps?q=San+Fernando,+Pampanga&output=embed"
              className="h-56 w-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
