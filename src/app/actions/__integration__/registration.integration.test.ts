import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

describe("registration db trigger", () => {
  const aliceId = crypto.randomUUID();

  it("should set up default metric tracking upon user creation", async () => {
    const adminSupabase = createClient(
      "http://localhost:54321",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU",
    );

    // Create test users with unique IDs
    await adminSupabase.auth.admin.createUser({
      id: aliceId,
      email: `${aliceId}@test.com`,
      password: "password123",
      email_confirm: true,
    });

    // Create initial entry
    const { data, error } = await adminSupabase
      .from("metric_tracking")
      .select("*")
      .eq("user_id", aliceId);

    expect(error).toBeNull();
    expect(data).toHaveLength(2);
  });
});
