"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { SiteConfig } from "@/lib/types";

export default function SettingsForm({ initialConfig }: { initialConfig: SiteConfig }) {
  const router = useRouter();

  const [name, setName] = useState(initialConfig.name);
  const [shortName, setShortName] = useState(initialConfig.shortName);
  const [tagline, setTagline] = useState(initialConfig.tagline);
  const [description, setDescription] = useState(initialConfig.description);
  const [phone, setPhone] = useState(initialConfig.phone);
  const [email, setEmail] = useState(initialConfig.email);
  const [address, setAddress] = useState(initialConfig.address);
  const [officeHours, setOfficeHours] = useState(initialConfig.officeHours);
  const [facebook, setFacebook] = useState(initialConfig.social.facebook);
  const [instagram, setInstagram] = useState(initialConfig.social.instagram);
  const [youtube, setYoutube] = useState(initialConfig.social.youtube);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSaved(false);

    const payload: SiteConfig = {
      name: name.trim(),
      shortName: shortName.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      officeHours: officeHours.trim(),
      social: {
        facebook: facebook.trim(),
        instagram: instagram.trim(),
        youtube: youtube.trim(),
      },
    };

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save settings");
      }

      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-black/5 bg-white p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-heading">Company Info</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-heading">Company Name</label>
            <input
              required
              value={name}
              name="name" onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-heading">Short Name</label>
            <input
              required
              value={shortName}
              name="shortName" onChange={(e) => setShortName(e.target.value)}
              className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-heading">Tagline</label>
          <input
            required
            value={tagline}
            name="tagline" onChange={(e) => setTagline(e.target.value)}
            className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-heading">Description (used for SEO)</label>
          <textarea
            required
            rows={3}
            value={description}
            name="description" onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
          />
        </div>
      </div>

      <div className="rounded-xl border border-black/5 bg-white p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-heading">Contact Info</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-heading">Phone</label>
            <input
              required
              value={phone}
              name="phone" onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-heading">Email</label>
            <input
              required
              type="email"
              value={email}
              name="email" onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-heading">Address</label>
          <input
            required
            value={address}
            name="address" onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-heading">Office Hours</label>
          <input
            required
            value={officeHours}
            name="officeHours" onChange={(e) => setOfficeHours(e.target.value)}
            className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
          />
        </div>
      </div>

      <div className="rounded-xl border border-black/5 bg-white p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-heading">Social Links</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-heading">Facebook</label>
            <input
              value={facebook}
              name="facebook" onChange={(e) => setFacebook(e.target.value)}
              className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-heading">Instagram</label>
            <input
              value={instagram}
              name="instagram" onChange={(e) => setInstagram(e.target.value)}
              className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-heading">YouTube</label>
            <input
              value={youtube}
              name="youtube" onChange={(e) => setYoutube(e.target.value)}
              className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && !error && <p className="text-sm text-emerald-600">Settings saved.</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark transition-colors disabled:opacity-60"
      >
        {submitting ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
