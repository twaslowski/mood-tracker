"use server";

import { createClient } from "@/lib/supabase/server";
import { CreateEntryInput, DBEntrySchema, type Entry } from "@/types/entry";
import { z } from "zod";

export const getEntriesByUser = async (): Promise<Entry[]> => {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Authentication failed. Please log in again.");
  }

  const { data, error } = await supabase
    .from("entry")
    .select("*, entry_value(*, metric:metric_id(*))")
    .eq("user_id", user.id)
    .order("recorded_at", { ascending: false });

  if (error) {
    throw new Error("Failed to fetch entries: " + error.message);
  }

  return z.array(DBEntrySchema).parse(data);
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
