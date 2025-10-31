import { render, screen } from "@testing-library/react";
import EntryCreationForm from "../entry-creation-form";
import { MoodTracking } from "../__fixtures__/tracking";
import userEvent from "@testing-library/user-event";

// Mock app router because <SubmitButton> relies on it
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

describe("EntryCreationForm", () => {
  it("should error on empty metrics", () => {
    render(<EntryCreationForm trackedMetrics={[MoodTracking]} />);

    const counter = screen.getByText("Metric 1 of 1");
    expect(counter).toBeInTheDocument();
  });

  it("should record metric and move on to the next one", async () => {
    render(<EntryCreationForm trackedMetrics={[MoodTracking]} />);

    const user = userEvent.setup();
    const selectButton = screen.getByLabelText("select-Mood-value-Neutral");
    expect(selectButton).toBeInTheDocument();

    await user.click(selectButton);

    const submitButton = screen.getByLabelText("submit-entry");
    expect(submitButton).toBeInTheDocument();
  });
});
