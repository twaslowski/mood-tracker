import { getUserTrackingInfo, configureDefaultTracking } from "../tracking";
import { createClient } from "@/lib/supabase/server";
import { getTrackingDefaults } from "@/lib/service/defaults";
import { moodTracking, mockUser } from "@/__fixtures__";

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("@/lib/service/defaults", () => ({
  getTrackingDefaults: jest.fn(),
}));

const mockedCreateClient = createClient as unknown as jest.Mock;
const mockedGetTrackingDefaults = getTrackingDefaults as jest.Mock;

describe("getUserTrackingInfo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns user tracking data when it exists", async () => {
    const selectMock = jest.fn().mockReturnThis();
    const eqMock = jest.fn().mockResolvedValue({
      data: [moodTracking],
      error: null,
    });

    mockedCreateClient.mockResolvedValue({
      from: jest.fn().mockReturnValue({
        select: selectMock,
      }),
    });
    selectMock.mockReturnValue({
      eq: eqMock,
    });

    const result = await getUserTrackingInfo(mockUser.id);

    expect(result).toEqual([moodTracking]);
  });

  it("throws error when fetching tracking info fails", async () => {
    const selectMock = jest.fn().mockReturnThis();
    const eqMock = jest.fn().mockResolvedValue({
      data: null,
      error: { message: "Database error" },
    });

    mockedCreateClient.mockResolvedValue({
      from: jest.fn().mockReturnValue({
        select: selectMock,
      }),
    });
    selectMock.mockReturnValue({
      eq: eqMock,
    });

    await expect(getUserTrackingInfo(mockUser.id)).rejects.toThrow(
      "Error fetching user tracking info: Database error",
    );
  });
});

describe("configureDefaultTracking", () => {
  let mockSupabase: unknown;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    mockSupabase = {
      auth: {
        admin: {
          getUserById: jest.fn(),
        },
      },
      from: jest.fn(),
    };

    mockedCreateClient.mockResolvedValue(mockSupabase);
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("does not insert data when user already has tracking configured", async () => {
    // Mock user validation
    mockSupabase.auth.admin.getUserById.mockResolvedValue({
      data: { id: mockUser.id },
      error: null,
    });

    // Mock getUserTrackingInfo to return existing tracking
    const selectMock = jest.fn().mockReturnThis();
    const eqMock = jest.fn().mockResolvedValue({
      data: [moodTracking],
      error: null,
    });
    mockSupabase.from.mockReturnValue({
      select: selectMock,
      insert: jest.fn(),
    });
    selectMock.mockReturnValue({
      eq: eqMock,
    });

    await configureDefaultTracking(mockUser.id);

    // Verify that getUserById was called
    expect(mockSupabase.auth.admin.getUserById).toHaveBeenCalledWith(
      mockUser.id,
    );

    // Verify that insert was never called
    expect(mockSupabase.from).toHaveBeenCalledWith("metric_tracking");
    expect(mockSupabase.from).not.toHaveBeenCalledWith("tracking_default");

    // Verify the log message
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "User already has tracking configured",
      mockUser.id,
    );

    // Verify getTrackingDefaults was never called
    expect(mockedGetTrackingDefaults).not.toHaveBeenCalled();
  });

  it("inserts default tracking when user has no tracking configured", async () => {
    const mockDefaults = [
      { metric_id: "metric-1", baseline: 5 },
      { metric_id: "metric-2", baseline: 3 },
    ];

    // Mock user validation
    mockSupabase.auth.admin.getUserById.mockResolvedValue({
      data: { id: mockUser.id },
      error: null,
    });

    // Mock getUserTrackingInfo to return empty array (no existing tracking)
    const selectMock = jest.fn().mockReturnThis();
    const eqMock = jest.fn().mockResolvedValue({
      data: [],
      error: null,
    });

    const insertMock = jest.fn().mockResolvedValue({
      data: {},
      error: null,
    });

    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "metric_tracking") {
        return {
          select: selectMock,
          insert: insertMock,
        };
      }
      return {
        select: jest.fn(),
        insert: jest.fn(),
      };
    });

    selectMock.mockReturnValue({
      eq: eqMock,
    });

    mockedGetTrackingDefaults.mockResolvedValue(mockDefaults);

    await configureDefaultTracking(mockUser.id);

    // Verify user validation
    expect(mockSupabase.auth.admin.getUserById).toHaveBeenCalledWith(
      mockUser.id,
    );

    // Verify getTrackingDefaults was called
    expect(mockedGetTrackingDefaults).toHaveBeenCalled();

    // Verify insert was called for each default
    expect(insertMock).toHaveBeenCalledTimes(2);
    expect(insertMock).toHaveBeenCalledWith({
      user_id: mockUser.id,
      metric_id: "metric-1",
      baseline: 5,
      tracked_at: expect.any(String),
    });
    expect(insertMock).toHaveBeenCalledWith({
      user_id: mockUser.id,
      metric_id: "metric-2",
      baseline: 3,
      tracked_at: expect.any(String),
    });

    // Verify success log
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Successfully set up tracking defaults for new user",
      mockUser.id,
    );
  });

  it("throws error when user ID is invalid", async () => {
    const userId = "invalid-user";

    // Mock user validation to fail
    mockSupabase.auth.admin.getUserById.mockResolvedValue({
      data: null,
      error: { message: "User not found" },
    });

    await expect(configureDefaultTracking(userId)).rejects.toThrow(
      "Invalid userId provided: User not found",
    );

    // Verify getTrackingDefaults was never called
    expect(mockedGetTrackingDefaults).not.toHaveBeenCalled();
  });

  it("throws error when no tracking defaults are found", async () => {
    // Mock user validation
    mockSupabase.auth.admin.getUserById.mockResolvedValue({
      data: { id: mockUser.id },
      error: null,
    });

    // Mock getUserTrackingInfo to return empty array
    const selectMock = jest.fn().mockReturnThis();
    const eqMock = jest.fn().mockResolvedValue({
      data: [],
      error: null,
    });
    mockSupabase.from.mockReturnValue({
      select: selectMock,
    });
    selectMock.mockReturnValue({
      eq: eqMock,
    });

    // Mock getTrackingDefaults to return empty array
    mockedGetTrackingDefaults.mockResolvedValue([]);

    await expect(configureDefaultTracking(mockUser.id)).rejects.toThrow(
      "No tracking defaults found",
    );
  });

  it("throws error when insert fails", async () => {
    const mockDefaults = [{ metric_id: "metric-1", baseline: 5 }];

    // Mock user validation
    mockSupabase.auth.admin.getUserById.mockResolvedValue({
      data: { id: mockUser.id },
      error: null,
    });

    // Mock getUserTrackingInfo to return empty array
    const selectMock = jest.fn().mockReturnThis();
    const eqMock = jest.fn().mockResolvedValue({
      data: [],
      error: null,
    });

    const insertMock = jest.fn().mockResolvedValue({
      data: null,
      error: { message: "Insert failed" },
    });

    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "metric_tracking") {
        return {
          select: selectMock,
          insert: insertMock,
        };
      }
      return {
        select: jest.fn(),
        insert: jest.fn(),
      };
    });

    selectMock.mockReturnValue({
      eq: eqMock,
    });

    mockedGetTrackingDefaults.mockResolvedValue(mockDefaults);

    await expect(configureDefaultTracking(mockUser.id)).rejects.toThrow(
      "Failed to set up default tracking: Insert failed",
    );

    // Verify insert was attempted
    expect(insertMock).toHaveBeenCalledTimes(1);
  });
});
