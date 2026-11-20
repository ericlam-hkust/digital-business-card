import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CardView } from "@/components/CardView";
import { cardDataSchema, type CardData } from "@/lib/card-schema";
import { defaultCard } from "@/config/card.config";

const withIcons = (card: CardData, on: boolean) => ({ ...card, show: { ...card.show, quickIcons: on } });

afterEach(cleanup);

describe("contact icons row", () => {
  it("is hidden when the setting is off", () => {
    render(<CardView card={withIcons(defaultCard, false)} />);
    expect(screen.queryByLabelText("Quick contact")).toBeNull();
  });
  it("shows when the setting is on", () => {
    render(<CardView card={withIcons(defaultCard, true)} />);
    expect(screen.getByLabelText("Quick contact")).toBeTruthy();
  });
  it("older saved cards without the setting keep the icons", () => {
    const { show, ...rest } = defaultCard;
    const { quickIcons: _q, ...oldShow } = show;
    const parsed = cardDataSchema.parse({ ...rest, show: oldShow });
    expect(parsed.show.quickIcons).toBe(true);
  });
  it("built-in card ships with the icons hidden", () => {
    expect(defaultCard.show.quickIcons).toBe(false);
  });
});
