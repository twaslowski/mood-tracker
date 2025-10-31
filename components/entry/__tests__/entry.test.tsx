import { render, screen } from "@testing-library/react";
import { Entry } from "../entry";

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

  it("should render entry with values", () => {
    const values = [
      { metric_id: "metric_1", value: 42, metric: { name: "metric 1" } },
      { metric_id: "metric_2", value: 3.14, metric: { name: "metric 2" } },
    ];
    const entryWithValues = {
      ...entry,
      values,
    };

    // @ts-expect-error: a subset of the expected type is enough for the test
    render(<Entry entry={entryWithValues} />);

    values.forEach(({ value, metric }) => {
      const metricElement = screen.getByText(new RegExp(metric.name, "i"));
      const valueElement = screen.getByText(new RegExp(value.toString(), "i"));
      expect(metricElement).toBeInTheDocument();
      expect(valueElement).toBeInTheDocument();
    });
  });
});
