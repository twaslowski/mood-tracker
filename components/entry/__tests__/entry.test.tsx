import { render, screen, within } from "@testing-library/react";
import { Entry } from "../entry";
import { Mood, Sleep } from "../__fixtures__/metric";
import { EntryValueWithMetric } from "@/types/entryValue";

const entry = {
  id: 123,
  user_id: "user_1",
  recorded_at: "2024-06-01T12:00:00Z",
  creation_timestamp: "2024-06-01T12:00:00Z",
  updated_timestamp: "2024-06-01T12:00:00Z",
};

describe("entry visualization", () => {
  it("should render single entry", () => {
    const entryWithoutValues = {
      ...entry,
      values: [],
    };
    render(<Entry entry={entryWithoutValues} />);

    const noRecords = screen.getByText("No values recorded");
    expect(noRecords).toBeInTheDocument();
  });

  it("should render entries with labels", () => {
    const values: EntryValueWithMetric[] = [
      { metric_id: Mood.id, value: 0, metric: Mood },
      { metric_id: Sleep.id, value: 7, metric: Sleep },
    ];
    const entryWithValues = {
      ...entry,
      values,
    };

    render(<Entry entry={entryWithValues} />);

    const moodBadge = screen.getByLabelText(
      `entry-${entry.id}-value-${Mood.name}`,
    );
    expect(moodBadge).toBeInTheDocument();
    expect(within(moodBadge).getByText("Neutral")).toBeInTheDocument();

    const sleepBadge = screen.getByLabelText(
      `entry-${entry.id}-value-${Sleep.name}`,
    );
    expect(sleepBadge).toBeInTheDocument();
    expect(within(sleepBadge).getByText("7")).toBeInTheDocument();
  });
});
