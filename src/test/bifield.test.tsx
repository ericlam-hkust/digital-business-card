// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { useState } from "react";
import { BiField } from "@/components/AdminFields";

function Host() {
  const [v, setV] = useState("");
  return <BiField label="T" values={[{ l: "en", value: v, onChange: setV }]} />;
}
describe("editor text box", () => {
  it("keeps the same box focused while typing", () => {
    const { getByRole } = render(<Host />);
    const box = getByRole("textbox") as HTMLInputElement;
    box.focus();
    fireEvent.change(box, { target: { value: "a" } });
    fireEvent.change(getByRole("textbox"), { target: { value: "ab" } });
    expect(getByRole("textbox")).toBe(box);
    expect(document.activeElement).toBe(box);
    expect(box.value).toBe("ab");
  });
});
