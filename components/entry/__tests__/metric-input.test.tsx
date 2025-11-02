import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MetricInput from "../metric-input";
import { Mood, Sleep } from "../__fixtures__/metric";

describe("MetricInput", () => {
  it("renders discrete metric options in descending order", () => {
    const handleSelect = jest.fn();
    render(<MetricInput metric={Mood} onMetricSelect={handleSelect} />);
    // Should render labels sorted by value descending: Happy, Neutral, Depressed
    const options = screen.getAllByRole("button");
    expect(options[0]).toHaveTextContent("Happy");
    expect(options[1]).toHaveTextContent("Neutral");
    expect(options[2]).toHaveTextContent("Depressed");
  });

  it("calls onMetricSelect with correct args for discrete metric", () => {
    const handleSelect = jest.fn();
    render(<MetricInput metric={Mood} onMetricSelect={handleSelect} />);
    const happyBtn = screen.getByLabelText("select-Mood-value-Happy");
    fireEvent.click(happyBtn);
    expect(handleSelect).toHaveBeenCalledWith(Mood.id, 1);
  });

  it("renders continuous metric options for the correct range", () => {
    const handleSelect = jest.fn();
    render(<MetricInput metric={Sleep} onMetricSelect={handleSelect} />);
    // Should render 25 options (0 to 24)
    const options = screen.getAllByRole("button");
    expect(options.length).toBe(25);
    expect(options[0]).toHaveTextContent("0");
    expect(options[24]).toHaveTextContent("24");
  });

  it("calls onMetricSelect with correct args for continuous metric", () => {
    const handleSelect = jest.fn();
    render(<MetricInput metric={Sleep} onMetricSelect={handleSelect} />);
    const btn = screen.getByText("8").closest("button");
    fireEvent.click(btn!);
    expect(handleSelect).toHaveBeenCalledWith(Sleep.id, 8);
  });

  it("throws error if discrete metric has no labels", () => {
    const badMetric = { ...Mood, labels: undefined };
    const handleSelect = jest.fn();
    // Suppress error output
    jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(<MetricInput metric={badMetric} onMetricSelect={handleSelect} />),
    ).toThrow(/labels defined/);
    (console.error as jest.Mock).mockRestore();
  });

  it("throws error if continuous metric has no min/max", () => {
    const badMetric = { ...Sleep, min_value: null, max_value: null };
    const handleSelect = jest.fn();
    jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(<MetricInput metric={badMetric} onMetricSelect={handleSelect} />),
    ).toThrow(/min and max values defined/);
    (console.error as jest.Mock).mockRestore();
  });
});
