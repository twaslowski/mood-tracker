import { render, screen } from "@testing-library/react";
import LandingPage from "../page";
import * as supabaseServer from "@/lib/supabase/server";

// Mock Next.js modules
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock Supabase client
jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

// Mock SuccessToast component to make it testable
jest.mock("@/components/entry/creation/success-toast", () => ({
  __esModule: true,
  default: ({ message }: { message?: string }) =>
    message ? <div data-testid="success-toast">{message}</div> : null,
}));

// Mock ActionCard component
jest.mock("@/components/action-card", () => ({
  ActionCard: ({ title }: { title: string }) => <div>{title}</div>,
}));

describe("LandingPage", () => {
  const mockCreateClient = jest.mocked(supabaseServer.createClient);

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock successful auth by default
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: "test-user-id" } },
          error: null,
        }),
      },
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  });

  it("displays SuccessToast when success=true is in searchParams", async () => {
    const searchParams = Promise.resolve({ success: "true" });

    const component = await LandingPage({ searchParams });
    render(component);

    const toast = screen.getByTestId("success-toast");
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent("Entry created successfully!");
  });

  it("does not display SuccessToast when success is not in searchParams", async () => {
    const searchParams = Promise.resolve({ success: undefined });

    const component = await LandingPage({ searchParams });
    render(component);

    const toast = screen.queryByTestId("success-toast");
    expect(toast).not.toBeInTheDocument();
  });

  it("does not display SuccessToast when success=false", async () => {
    const searchParams = Promise.resolve({ success: "false" });

    const component = await LandingPage({ searchParams });
    render(component);

    const toast = screen.queryByTestId("success-toast");
    expect(toast).not.toBeInTheDocument();
  });
});
