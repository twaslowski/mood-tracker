import { signInWithProvider, signUpWithEmail } from "../auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { configureDefaultTracking } from "@/lib/service/tracking";

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/lib/service/tracking", () => ({
  configureDefaultTracking: jest.fn(),
}));

const mockedCreateClient = createClient as unknown as jest.Mock;
const mockedRedirect = redirect as unknown as jest.Mock;
const mockedConfigureDefaultTracking = configureDefaultTracking as jest.Mock;

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

describe("signUpWithEmail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("successfully signs up a user and configures default tracking", async () => {
    const mockUser = { id: "user-123", email: "test@example.com" };
    const signUpMock = jest.fn().mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });
    mockedCreateClient.mockResolvedValue({
      auth: { signUp: signUpMock },
    });
    mockedConfigureDefaultTracking.mockResolvedValue(undefined);

    await signUpWithEmail("test@example.com", "password123");

    expect(signUpMock).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
    expect(mockedConfigureDefaultTracking).toHaveBeenCalledWith("user-123");
  });

  it("throws error when sign-up fails", async () => {
    const error = new Error("Email already exists");
    const signUpMock = jest.fn().mockResolvedValue({
      data: { user: null },
      error,
    });
    mockedCreateClient.mockResolvedValue({
      auth: { signUp: signUpMock },
    });

    await expect(
      signUpWithEmail("test@example.com", "password123"),
    ).rejects.toThrow("Sign-up error: Email already exists");

    expect(signUpMock).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
    expect(mockedConfigureDefaultTracking).not.toHaveBeenCalled();
  });

  it("throws error when user is not returned", async () => {
    const signUpMock = jest.fn().mockResolvedValue({
      data: { user: null },
      error: null,
    });
    mockedCreateClient.mockResolvedValue({
      auth: { signUp: signUpMock },
    });

    await expect(
      signUpWithEmail("test@example.com", "password123"),
    ).rejects.toThrow("Sign-up error: undefined");

    expect(mockedConfigureDefaultTracking).not.toHaveBeenCalled();
  });

  it("logs error but does not throw when configureDefaultTracking fails", async () => {
    const mockUser = { id: "user-123", email: "test@example.com" };
    const signUpMock = jest.fn().mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });
    mockedCreateClient.mockResolvedValue({
      auth: { signUp: signUpMock },
    });
    mockedConfigureDefaultTracking.mockRejectedValue(
      new Error("Failed to configure tracking"),
    );

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    await signUpWithEmail("test@example.com", "password123");

    expect(signUpMock).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
    expect(mockedConfigureDefaultTracking).toHaveBeenCalledWith("user-123");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to set up defaults for new user:",
      "user-123",
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });
});
