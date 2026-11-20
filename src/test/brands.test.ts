import { describe, expect, it } from "vitest";
import { findBrand } from "@/lib/brands";
import { cardDataSchema } from "@/lib/card-schema";
import { defaultCard } from "@/config/card.config";

describe("brand logos", () => {
  it("matches company names typed in different ways", () => {
    expect(findBrand("Puma Group")?.key).toBe("puma");
    expect(findBrand("利豐")?.key).toBe("lifung");
    expect(findBrand("tiffany & co.")?.key).toBe("tiffany");
  });
  it("returns no logo for unknown companies", () => {
    expect(findBrand("Acme Ltd")).toBeNull();
  });
  it("older saved cards without brands still get the default list", () => {
    const { brands: _b, ...old } = defaultCard;
    const r = cardDataSchema.parse(old);
    expect(r.brands.names).toContain("PUMA");
  });
});
