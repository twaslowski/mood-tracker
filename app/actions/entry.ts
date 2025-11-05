"use server";

import { createClient } from "@/lib/supabase/server";
import { getUserId } from "@/lib/service/userService";
import { revalidatePath } from "next/cache";

export const deleteEntry = async (entryId: number) => {
  const supabase = await createClient();
  const userId = await getUserId(supabase);

  const { error, count } = await supabase
    .from("entry")
    .delete()
    .eq("id", entryId)
    .eq("user_id", userId)
    .select("id");

  if (error) throw error;
  if (count === 0) throw new Error("No entry deleted");

  // Revalidate the insights page to show updated entry list
  revalidatePath("/protected/insights");
};
