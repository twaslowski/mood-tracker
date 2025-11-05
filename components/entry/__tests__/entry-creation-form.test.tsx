import { render, screen } from "@testing-library/react";
import EntryCreationForm from "../entry-creation-form";
import { moodTracking } from "@/__fixtures__/tracking";

// Mock app router because <SubmitButton> relies on it
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

  // todo fix test
  // it("allows changing the metric selection and keeps submit enabled", async () => {
  //   render(<EntryCreationForm trackedMetrics={[MoodTracking]} />);
  //   const user = userEvent.setup();
  //
  //   const trigger = screen.getByLabelText("select-Mood");
  //   await user.click(trigger);
  //
  //   // Click on the 'Happy' option (value 1)
  //   const happyOption = await screen.findByText(/Happy/);
  //   await user.click(happyOption);
  //
  //   const submitButton = screen.getByLabelText("submit-entry");
  //   expect(submitButton).toBeInTheDocument();
  // });
});
