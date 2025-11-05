import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client for integration testing.
 * This client uses service role key for admin operations and can bypass RLS.
 */
export function createTestClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing Supabase environment variables for testing. " +
        "Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.",
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Creates a Supabase client authenticated as a specific user for integration testing.
 * This simulates a user session for testing purposes.
 */
export async function createAuthenticatedTestClient(userId: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing Supabase environment variables for testing. " +
        "Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.",
    );
  }

  const client = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // Generate a valid JWT token for the user
  const { data, error } = await client.auth.admin.generateLink({
    type: "magiclink",
    email: `test-${userId}@example.com`,
    options: {
      data: {
        userId,
      },
    },
  });

  if (error) {
    throw new Error(`Failed to generate auth link: ${error.message}`);
  }

  return client;
}
