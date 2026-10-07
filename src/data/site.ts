import { revalidatePath } from "next/cache";
import { readJsonFile, writeJsonFile } from "@/lib/json-store";
import { SiteConfig } from "@/lib/types";

const DATA_PATH = "site.json";

export function getSiteConfig(): SiteConfig {
  return readJsonFile<SiteConfig>(DATA_PATH);
}

export function updateSiteConfig(config: SiteConfig): SiteConfig {
  writeJsonFile(DATA_PATH, config);
  revalidatePath("/", "layout");
  return config;
}

export const mainNav = [
  { label: "Home", href: "/" },
  {
    label: "House and Lot",
    href: "/listings?type=house-and-lot",
  },
  {
    label: "Condo",
    href: "/listings?type=condo",
  },
  {
    label: "Other Properties",
    href: "/listings?type=other",
  },
  { label: "Services", href: "/services" },
  { label: "News", href: "/news" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const propertyTypeLabels: Record<string, string> = {
  "house-and-lot": "House and Lot",
  condo: "Condominium",
  other: "Other Properties",
};
