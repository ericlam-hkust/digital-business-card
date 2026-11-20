/** Logo catalogue: a company name typed in Settings is matched to a logo here. */
export type Brand = { key: string; name: string; logo: string; aliases: string[] };

export const brandCatalog: Brand[] = [
  { key: "puma", name: "PUMA", logo: "/brands/puma.svg", aliases: ["puma", "puma group", "puma se"] },
  { key: "lifung", name: "Li & Fung", logo: "/brands/lifung.svg", aliases: ["li & fung", "li and fung", "lifung", "li fung", "利豐"] },
  { key: "pandora", name: "Pandora", logo: "/brands/pandora.svg", aliases: ["pandora", "pandora jewelry", "pandora jewellery"] },
  { key: "tiffany", name: "Tiffany & Co.", logo: "/brands/tiffany.svg", aliases: ["tiffany", "tiffany & co", "tiffany and co", "tiffany & co."] },
  { key: "nike", name: "Nike", logo: "/brands/nike.svg", aliases: ["nike", "nike inc"] },
];

const norm = (s: string) => s.toLowerCase().replace(/[.,]/g, "").replace(/\s+/g, " ").trim();

/** Returns the catalogue logo for a company name, or null when none matches. */
export function findBrand(name: string): Brand | null {
  const n = norm(name);
  if (!n) return null;
  return brandCatalog.find((b) => b.aliases.some((a) => norm(a) === n)) ?? null;
}
