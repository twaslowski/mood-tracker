import { signInWithProvider } from "../auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

const mockedCreateClient = createClient as unknown as jest.Mock;
const mockedRedirect = redirect as unknown as jest.Mock;

describe("signInWithProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects to provider url for supported provider", async () => {
    const signInMock = jest
      .fn()
      .mockResolvedValue({ data: { url: "https://example.com" }, error: null });
    mockedCreateClient.mockResolvedValue({
      auth: { signInWithOAuth: signInMock },
    });

    await signInWithProvider({ name: "github" });

    expect(signInMock).toHaveBeenCalledWith({
      provider: "github",
      options: expect.any(Object),
    });
    expect(mockedRedirect).toHaveBeenCalledWith("https://example.com");
  });

  it("redirects to error page when provider returns an error", async () => {
    const error = new Error("Unsupported provider");
    const signInMock = jest.fn().mockResolvedValue({ data: null, error });
    mockedCreateClient.mockResolvedValue({
      auth: { signInWithOAuth: signInMock },
    });

    await signInWithProvider({ name: "github" });

    expect(signInMock).toHaveBeenCalledWith({
      provider: "github",
      options: expect.any(Object),
    });
    expect(mockedRedirect).toHaveBeenCalledWith(
      "/auth/error?message=Unsupported%20provider",
    );
  });

  it("redirects to error page when no url is returned", async () => {
    const signInMock = jest.fn().mockResolvedValue({ data: {}, error: null });
    mockedCreateClient.mockResolvedValue({
      auth: { signInWithOAuth: signInMock },
    });

    await signInWithProvider({ name: "google" });

    expect(signInMock).toHaveBeenCalledWith({
      provider: "google",
      options: expect.any(Object),
    });
    expect(mockedRedirect).toHaveBeenCalledWith(
      "/auth/error?message=Unable to initiate authentication",
    );
  });
});
