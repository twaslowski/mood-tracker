import { render, screen } from "@testing-library/react";
import EntryCreationForm from "../entry-creation-form";
import { moodTracking } from "@/__fixtures__/tracking";

// router required by the SubmitButton component
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      prefetch: () => null,
    };
  },
}));

describe("EntryCreationForm", () => {
  it("preselects the baseline value on initial render", () => {
    render(<EntryCreationForm trackedMetrics={[moodTracking]} />);
    // Select trigger should exist
    const trigger = screen.getByLabelText("select-Mood");
    expect(trigger).toBeInTheDocument();

    expect(trigger).toHaveTextContent(/Neutral/);
  });
});
