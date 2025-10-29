import { render, screen } from "@testing-library/react";
import { Entry } from "../entry";

const entry = {
  id: 123,
  user_id: "user_1",
  recorded_at: "2024-06-01T12:00:00Z",
  creation_timestamp: "2024-06-01T12:00:00Z",
  updated_timestamp: "2024-06-01T12:00:00Z",
};

describe("Entry Component", () => {
  it("should render single entry", () => {
    const entryWithoutValues = {
      ...entry,
      values: [],
    };
    render(<Entry entry={entryWithoutValues} />);

    const noRecords = screen.getByText("No values recorded");
    expect(noRecords).toBeInTheDocument();
  });

  it("should render entry with values", () => {
    const values = [
      { metric_id: "metric_1", value: 42 },
      { metric_id: "metric_2", value: 3.14 },
    ];
    const entryWithValues = {
      ...entry,
      values,
    };

    render(<Entry entry={entryWithValues} />);

    values.forEach(({ metric_id, value }) => {
      const metricElement = screen.getByText(new RegExp(metric_id, "i"));
      const valueElement = screen.getByText(new RegExp(value.toString(), "i"));
      expect(metricElement).toBeInTheDocument();
      expect(valueElement).toBeInTheDocument();
    });
  });
});
