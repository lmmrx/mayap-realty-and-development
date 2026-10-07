import Link from "next/link";
import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Services",
  description: "Titling assistance, property appraisal, sales and marketing, and loan assistance services.",
};

const services = [
  {
    title: "Titling Assistance",
    description:
      "We help guide buyers through Deed of Sale execution, tax payments, and title transfer with the Registry of Deeds.",
    points: [
      "Document preparation and review",
      "Coordination with developers and government offices",
      "Progress updates until title release",
    ],
  },
  {
    title: "Property Appraisal",
    description:
      "Get a realistic market valuation for resale properties, lots, and inherited land before you sell or invest.",
    points: [
      "Comparative market analysis",
      "Site inspection and documentation review",
      "Written appraisal summary",
    ],
  },
  {
    title: "Sales & Marketing",
    description:
      "For property owners and developers, we offer dedicated sales and marketing support to reach qualified buyers.",
    points: [
      "Listing exposure across our channels",
      "Buyer screening and site visit coordination",
      "Negotiation and closing support",
    ],
  },
  {
    title: "Loan & Financing Assistance",
    description:
      "We help you compare Pag-IBIG, bank, and in-house financing options to find the scheme that fits your budget.",
    points: [
      "Pre-qualification guidance",
      "Requirements checklist and document review",
      "Coordination with loan officers",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div>
      <section className="bg-cream py-20">
        <div className="container-page">
          <span className="inline-block text-brand font-semibold text-sm tracking-wide uppercase mb-2">
            Services
          </span>
          <h1 className="max-w-2xl text-4xl sm:text-5xl font-bold text-heading tracking-tight">
            End-to-End Support, From Site Visit to Titling
          </h1>
          <p className="mt-5 max-w-xl text-body">
            Beyond listings, our team assists with the paperwork and decisions that come with
            buying, selling, or investing in Pampanga real estate.
          </p>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <SectionHeading eyebrow="What We Offer" title="Our Services" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {services.map((service) => (
            <div key={service.title} className="rounded-xl border border-black/5 bg-white p-7 shadow-sm">
              <h3 className="text-xl font-bold text-heading">{service.title}</h3>
              <p className="mt-2 text-sm text-body leading-relaxed">{service.description}</p>
              <ul className="mt-4 space-y-2">
                {service.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-body">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand">
        <div className="container-page py-14 flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Need help with a specific concern?
            </h2>
            <p className="mt-2 text-white/85">Reach out and our team will walk you through it.</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center justify-center rounded-md bg-ink px-7 py-3.5 text-sm font-semibold text-white hover:bg-ink-light transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
