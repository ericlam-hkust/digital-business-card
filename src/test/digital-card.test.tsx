import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CardView } from "@/components/CardView";
import { cardDataSchema, type CardData } from "@/lib/card-schema";
import { defaultCard } from "@/config/card.config";

const withDigitalCard = (card: CardData, on: boolean) => ({ ...card, show: { ...card.show, digitalCard: on } });

afterEach(cleanup);

describe("Digital Card contact row", () => {
  it("is hidden when the setting is off", () => {
    render(<CardView card={withDigitalCard(defaultCard, false)} />);
    expect(screen.queryByText("電子名片")).toBeNull();
  });
  it("shows when the setting is on", () => {
    render(<CardView card={withDigitalCard(defaultCard, true)} />);
    expect(screen.getByText("電子名片")).toBeTruthy();
  });
  it("older saved cards without the setting keep the row", () => {
    const { show, ...rest } = defaultCard;
    const { digitalCard: _d, ...oldShow } = show;
    const parsed = cardDataSchema.parse({ ...rest, show: oldShow });
    expect(parsed.show.digitalCard).toBe(true);
  });
});
