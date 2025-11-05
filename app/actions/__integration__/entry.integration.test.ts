import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { createEntryInput } from "@/__fixtures__";

describe("entry RLS", () => {
  // Generate unique IDs for this test suite to avoid conflicts with other tests
  const aliceId = crypto.randomUUID();
  const bobId = crypto.randomUUID();

  // todo: these values should not remain hardcoded, but dealing with environment variables
  //  is surprisingly difficult in jest.
  const supabase = createClient(
    "http://localhost:54321",
    "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH",
  );

  beforeAll(async () => {
    // Setup test data specific to this test suite
    const adminSupabase = createClient(
      "http://localhost:54321",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU",
    );

    // Create test users with unique IDs
    await adminSupabase.auth.admin.createUser({
      id: aliceId,
      email: `alice-${aliceId}@test.com`,
      password: "password123",
      // We want the user to be usable right away without email confirmation
      email_confirm: true,
    });

    await adminSupabase.auth.admin.createUser({
      id: bobId,
      email: `bob-${bobId}@test.com`,
      password: "password123",
      email_confirm: true,
    });

    // Create initial entry
    let { data } = await adminSupabase
      .from("entry")
      .insert([
        { recorded_at: new Date(), user_id: aliceId },
        { recorded_at: new Date(), user_id: bobId },
      ])
      .select("*");

    console.log("Inserted initial entries:", data);
  });

  it("should allow Alice to only see their own entries", async () => {
    // Sign in as Alice
    const adminSupabase = createClient(
      "http://localhost:54321",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU",
    );

    await supabase.auth.signInWithPassword({
      email: `alice-${aliceId}@test.com`,
      password: "password123",
    });

    const { data: entries } = await supabase.from("entry").select("*");

    expect(entries).toHaveLength(1);
    entries?.forEach((entry) => {
      expect(entry.user_id).toBe(aliceId);
    });
  });

  // todo: fix entry fixture
  it("should allow Alice to create her own entry", async () => {
    await supabase.auth.signInWithPassword({
      email: `alice-${aliceId}@test.com`,
      password: "password123",
    });

    const { error } = await supabase
      .from("entry")
      .insert({ recorded_at: new Date(), user_id: aliceId });

    expect(error).toBeNull();
  });

  it("should allow Bob to only see his own entries", async () => {
    // Sign in as Bob
    await supabase.auth.signInWithPassword({
      email: `bob-${bobId}@test.com`,
      password: "password123",
    });

    const { data: entries } = await supabase.from("entries").select("*");

    expect(entries).toHaveLength(1);
    entries?.forEach((entry) => {
      expect(entry.user_id).toBe(bobId);
    });
  });

  it("should prevent Bob from modifying Alice entries", async () => {
    await supabase.auth.signInWithPassword({
      email: `bob-${bobId}@test.com`,
      password: "password123",
    });

    // Attempt to update the entries we shouldn't have access to
    // result will be a no-op
    await supabase.from("entry").update({ id: 42069 }).eq("user_id", aliceId);

    // Log back in as Alice to verify their entries weren't changed
    await supabase.auth.signInWithPassword({
      email: `alice-${aliceId}@test.com`,
      password: "password123",
    });

    // Fetch Alice's entries
    const { data: entries } = await supabase.from("entry").select("*");

    // Verify that none of the entries were changed to "Hacked!"
    expect(entries).toBeDefined();
    expect(entries).toHaveLength(1);
    entries?.forEach((entry) => {
      expect(entry.id).not.toBe(42069);
    });
  });
});
