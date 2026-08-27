import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { notify } from "./notify";
import { Toaster } from "./components/ui/sonner";

describe("notify", () => {
  beforeEach(() => {
    render(<Toaster position="bottom-right" />);
  });

  it("should render success toast", async () => {
    notify("success", "Success message");

    expect(
      await screen.findByText("Success message")
    ).toBeInTheDocument();

    const icon = await screen.findByTestId("toast-icon");

    expect(icon.parentElement).toHaveClass("text-green-400");
  });

  it("should render error toast", async () => {
    notify("error", "Error message");

    expect(
      await screen.findByText("Error message")
    ).toBeInTheDocument();

    const icon = await screen.findByTestId("toast-icon");

    expect(icon.parentElement).toHaveClass("text-red-400");
  });

  it("should render warning toast", async () => {
    notify("warning", "Warning message");

    expect(
      await screen.findByText("Warning message")
    ).toBeInTheDocument();

    const icon = await screen.findByTestId("toast-icon");

    expect(icon.parentElement).toHaveClass("text-yellow-400");
  });

  it("should render info toast", async () => {
    notify("info", "Info message");

    expect(
      await screen.findByText("Info message")
    ).toBeInTheDocument();

    const icon = await screen.findByTestId("toast-icon");

    expect(icon.parentElement).toHaveClass("text-blue-400");
  });
});