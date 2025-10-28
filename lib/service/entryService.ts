"use server";

import { createClient } from "@/lib/supabase/server";
import { CreateEntryInput, EntryWithValues } from "@/types/entry";

export const getEntriesByUser = async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Authentication failed. Please log in again.");
  }

  const { data: entries, error: entriesError } = await supabase
    .from("entry")
    .select("*, entry_value(*)")
    .eq("user_id", user.id)
    .order("recorded_at", { ascending: false });

  if (entriesError) {
    throw new Error("Failed to fetch entries: " + entriesError.message);
  }

  const transformedEntries: EntryWithValues[] = (entries || []).map(
    (entry: any) => ({
      id: entry.id,
      user_id: entry.user_id,
      recorded_at: entry.recorded_at,
      creation_timestamp: entry.creation_timestamp,
      updated_timestamp: entry.updated_timestamp,
      values: entry.entry_value || [],
    }),
  );

  return transformedEntries;
};

export const createEntry = async (
  createEntryInput: CreateEntryInput,
): Promise<string> => {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Authentication failed. Please log in again.");
  }

  const { data: entryData, error: entryError } = await supabase
    .from("entry")
    .insert({
      user_id: user.id,
      recorded_at: createEntryInput.recordedAt,
      creation_timestamp: new Date().toISOString(),
      updated_timestamp: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (entryError || !entryData) {
    throw new Error("Failed to create entry: " + entryError?.message);
  }

  const entryId = entryData.id;

  const valuesToInsert = createEntryInput.values.map((value) => ({
    entry_id: entryId,
    metric_id: value.metric_id,
    value: value.value,
  }));

  console.log("Inserting entry values:", valuesToInsert);

  const { error: valuesError } = await supabase
    .from("entry_value")
    .insert(valuesToInsert);

  if (valuesError) {
    // Rollback: delete the created entry if inserting values fails
    await supabase.from("entry").delete().eq("id", entryId);
    throw new Error("Failed to create entry values: " + valuesError.message);
  }

  return entryId;
};
