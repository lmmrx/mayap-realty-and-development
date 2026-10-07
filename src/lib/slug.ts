export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function uniqueSlug(base: string, existingSlugs: string[]): string {
  const root = slugify(base) || "item";
  if (!existingSlugs.includes(root)) return root;

  let counter = 2;
  while (existingSlugs.includes(`${root}-${counter}`)) {
    counter += 1;
  }
  return `${root}-${counter}`;
}
