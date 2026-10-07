import Image from "next/image";
import Link from "next/link";
import QuickSearch from "@/components/QuickSearch";
import SectionHeading from "@/components/SectionHeading";
import PropertyCard from "@/components/PropertyCard";
import { getFeaturedListings, getListingCities } from "@/data/listings";
import { getAllNews } from "@/data/news";
import { formatDate } from "@/lib/format";
import { imageSource } from "@/lib/image";

const propertyTypes = [
  {
    label: "House and Lot",
    href: "/listings?type=house-and-lot",
    image: "https://picsum.photos/seed/mayap-type-house/800/600",
    description: "Single-detached, duplex, and townhouse communities across Pampanga.",
  },
  {
    label: "Condominium",
    href: "/listings?type=condo",
    image: "https://picsum.photos/seed/mayap-type-condo/800/600",
    description: "Resort-style and city-view condo units near business districts.",
  },
  {
    label: "Other Properties",
    href: "/listings?type=other",
    image: "https://picsum.photos/seed/mayap-type-other/800/600",
    description: "Memorial lots, commercial lots, and resale properties.",
  },
];

const reasons = [
  {
    title: "Direct Developer Prices",
    description: "No mark-ups. You get the same price and promos as walking directly into a developer's office.",
  },
  {
    title: "Free Site Visits",
    description: "We arrange and accompany you on scheduled site visits to any of our listed developments.",
  },
  {
    title: "Loan & Financing Assistance",
    description: "From Pag-IBIG to in-house and bank financing, we help you find the right payment scheme.",
  },
  {
    title: "Trusted Titling Support",
    description: "Our team guides you through documentation, titling, and turnover requirements.",
  },
];

const testimonials = [
  {
    name: "Marie A.",
    location: "OFW, Dubai",
    quote:
      "Mayap Realty made it possible for me to buy a house and lot in San Fernando while working abroad. Everything was handled transparently, from reservation to titling.",
  },
  {
    name: "Jun & Liza P.",
    location: "Angeles City",
    quote:
      "We compared a few brokers before deciding, and Mayap gave us the most direct and honest answers about pricing and turnover timelines.",
  },
  {
    name: "Ramon D.",
    location: "Investor, Manila",
    quote:
      "Bought a condo unit in San Fernando as an investment property. The team followed up on paperwork so I didn't have to travel back and forth.",
  },
];

export default function Home() {
  const featured = getFeaturedListings();
  const latestNews = getAllNews().slice(0, 3);

  return (
    <>
      <section className="relative flex min-h-[600px] items-center overflow-hidden bg-ink">
        <Image
          src="https://picsum.photos/seed/mayap-hero/1920/1080"
          alt="Pampanga real estate development"
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />

        <div className="container-page relative z-10 py-24">
          <span className="inline-block rounded-full bg-brand/15 px-4 py-1 text-sm font-semibold text-brand-light border border-brand/30 mb-5">
            Pampanga&apos;s Trusted Property Partner
          </span>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Find Your Next Home or Investment in Pampanga
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/80">
            House and lot, condominiums, and investment properties across San Fernando, Angeles,
            Mabalacat, Porac, and beyond — at direct developer prices.
          </p>

          <div className="mt-8">
            <QuickSearch cities={getListingCities()} />
          </div>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <SectionHeading
          eyebrow="Browse by Category"
          title="What Are You Looking For?"
          description="Explore our three main property categories, each curated with trusted developers across Pampanga."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {propertyTypes.map((type) => (
            <Link
              key={type.label}
              href={type.href}
              className="group relative block overflow-hidden rounded-xl aspect-[4/3]"
            >
              <Image
                src={type.image}
                alt={type.label}
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="text-xl font-bold text-white">{type.label}</h3>
                <p className="mt-1 text-sm text-white/80">{type.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-light">
                  View Listings
                  <span aria-hidden>&rarr;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-cream py-16 lg:py-20">
        <div className="container-page">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Featured Developments"
              title="Handpicked Properties Across Pampanga"
            />
            <Link
              href="/listings"
              className="text-sm font-semibold text-brand hover:text-brand-dark whitespace-nowrap"
            >
              View All Listings &rarr;
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((listing) => (
              <PropertyCard key={listing.slug} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <SectionHeading
          eyebrow="Why Mayap Realty"
          title="A Team That Works For You, Not the Developer"
          description="We help you compare options across multiple developers so you can make the best decision for your family or investment goals."
        />
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => (
            <div key={reason.title} className="rounded-xl border border-black/5 p-6 bg-white shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand font-bold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-bold text-heading">{reason.title}</h3>
              <p className="mt-2 text-sm text-body leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream py-16 lg:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Client Stories"
            title="What Our Clients Say"
            align="center"
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-xl bg-white p-6 border border-black/5 shadow-sm">
                <p className="text-body text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5">
                  <p className="font-semibold text-heading">{t.name}</p>
                  <p className="text-xs text-body/70">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="News & Insights" title="Latest From Our Blog" />
          <Link href="/news" className="text-sm font-semibold text-brand hover:text-brand-dark whitespace-nowrap">
            View All Articles &rarr;
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latestNews.map((post) => (
            <Link
              key={post.slug}
              href={`/news/${post.slug}`}
              className="group block overflow-hidden rounded-xl border border-black/5 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  {...imageSource(post.image)}
                  alt={post.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand">{post.category}</p>
                <h3 className="mt-1 font-bold text-heading group-hover:text-brand transition-colors">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-body line-clamp-2">{post.excerpt}</p>
                <p className="mt-3 text-xs text-body/70">{formatDate(post.date)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-brand">
        <div className="container-page py-14 flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Ready to find your property in Pampanga?
            </h2>
            <p className="mt-2 text-white/85">
              Talk to our team today and get direct developer pricing with no hidden fees.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center justify-center rounded-md bg-ink px-7 py-3.5 text-sm font-semibold text-white hover:bg-ink-light transition-colors"
          >
            Send an Inquiry
          </Link>
        </div>
      </section>
    </>
  );
}
