import Image from "next/image";
import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import { getSiteConfig } from "@/data/site";

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = getSiteConfig();
  return {
    title: "About Us",
    description: `Learn more about ${siteConfig.name} and our mission to make Pampanga real estate accessible.`,
  };
}

const values = [
  {
    title: "Transparency",
    description: "We disclose direct developer prices, promos, and fees with no hidden mark-ups.",
  },
  {
    title: "Accessibility",
    description: "We work with local buyers, OFWs, and investors, wherever they are based.",
  },
  {
    title: "Reliability",
    description: "From reservation to titling, our team follows through on every transaction.",
  },
];

export default function AboutPage() {
  const siteConfig = getSiteConfig();

  return (
    <div>
      <section className="relative bg-cream py-20">
        <div className="container-page">
          <span className="inline-block text-brand font-semibold text-sm tracking-wide uppercase mb-2">
            About Us
          </span>
          <h1 className="max-w-2xl text-4xl sm:text-5xl font-bold text-heading tracking-tight">
            Helping Kapampangans and Investors Build Their Future, One Property at a Time
          </h1>
          <p className="mt-5 max-w-xl text-body">
            {siteConfig.name} connects buyers with trusted developers across Pampanga, offering
            house and lot, condominium, and investment properties at direct developer prices.
          </p>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image
            src="https://picsum.photos/seed/mayap-about-team/1000/750"
            alt="Mayap Realty team"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <SectionHeading eyebrow="Our Story" title="Built on Local Knowledge and Straightforward Service" />
          <div className="mt-5 space-y-4 text-body leading-relaxed">
            <p>
              {siteConfig.name} started with a simple goal: make it easier for Kapampangans, OFWs,
              and investors to find and understand their real estate options in Pampanga, without
              having to visit multiple developer offices or compare confusing price sheets.
            </p>
            <p>
              Today, our team works with major developers across San Fernando, Angeles, Mabalacat,
              Porac, Magalang, and Mexico, covering house and lot communities, condominiums, and
              other property types, including memorial lots.
            </p>
            <p>
              We guide clients through every step, from choosing a property and financing scheme
              to titling and turnover, so buying property in Pampanga feels less overwhelming and
              more like a partnership.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 lg:py-20">
        <div className="container-page">
          <SectionHeading eyebrow="What We Stand For" title="Our Core Values" align="center" />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="rounded-xl bg-white p-6 shadow-sm border border-black/5">
                <h3 className="font-bold text-heading">{value.title}</h3>
                <p className="mt-2 text-sm text-body leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
