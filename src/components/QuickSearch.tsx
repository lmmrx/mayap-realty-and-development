export default function QuickSearch({ cities }: { cities: string[] }) {
  return (
    <form
      action="/listings"
      method="get"
      className="w-full max-w-3xl rounded-xl bg-white p-3 shadow-xl sm:flex sm:items-stretch sm:gap-3 sm:p-2"
    >
      <select
        name="type"
        defaultValue="all"
        className="w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm text-heading sm:w-auto"
      >
        <option value="all">All Property Types</option>
        <option value="house-and-lot">House and Lot</option>
        <option value="condo">Condominium</option>
        <option value="other">Other Properties</option>
      </select>

      <select
        name="city"
        defaultValue="Any Location"
        className="mt-2 w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm text-heading sm:mt-0 sm:w-auto"
      >
        <option value="Any Location">Any Location</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="mt-2 w-full shrink-0 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark transition-colors sm:mt-0 sm:w-auto"
      >
        Search Properties
      </button>
    </form>
  );
}
