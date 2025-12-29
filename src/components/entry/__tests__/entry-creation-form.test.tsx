import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EntryCreationForm from "../creation/entry-creation-form";
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
  it("should select baseline on first render", () => {
    render(<EntryCreationForm trackedMetrics={[moodTracking]} />);
    // Select trigger should exist
    const trigger = screen.getByLabelText("select-Mood");
    expect(trigger).toBeInTheDocument();

    expect(trigger).toHaveTextContent(/Neutral/);
  });

  it("should allow users to modify values", async () => {
    render(<EntryCreationForm trackedMetrics={[moodTracking]} />);

    // Select trigger should exist and show initial "Neutral" value
    const trigger = screen.getByLabelText("select-Mood");
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent(/Neutral/);

    // Click the trigger to open the dropdown
    fireEvent.click(trigger);

    // Wait for dropdown content to appear and select "Depressed"
    await waitFor(() => {
      expect(screen.getByText("Depressed")).toBeInTheDocument();
    });

    const depressedOption = screen.getByText("Depressed");
    fireEvent.click(depressedOption);

    // Verify that the trigger now shows "Depressed"
    await waitFor(() => {
      expect(trigger).toHaveTextContent(/Depressed/);
    });
  });
});
